package persistence

import (
	"fmt"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

const (
	idAttribute  string = "id"
	urlAttribute string = "url"
	ttlAttribute string = "ttl"
)

type Connection struct {
	ID  string
	Url string
}

type connectionItemResult struct {
	ID   string `json:"id"`
	Url  string `json:"url"`
	Date int    `json:"sk"`
}

func makeConnectionsPK() *string {
	return aws.String("connectionId")
}

func makeConnectionsSK(now time.Time) *string {
	return timeToUnixTimestampString(now)
}

func makeConnectionsKey(now time.Time) map[string]*dynamodb.AttributeValue {
	return map[string]*dynamodb.AttributeValue{
		"pk": {
			S: makeConnectionsPK(),
		},
		"sk": {
			N: makeConnectionsSK(now),
		},
	}
}

func timeToUnixTimestampString(t time.Time) *string {
	return aws.String(fmt.Sprintf("%d", t.Unix()))
}

func makeConnectionsItem(id string, url string, now time.Time) (out map[string]*dynamodb.AttributeValue) {
	out = makeConnectionsKey(now)
	out[idAttribute] = &dynamodb.AttributeValue{
		S: aws.String(id),
	}
	out[urlAttribute] = &dynamodb.AttributeValue{
		S: aws.String(url),
	}
	out[ttlAttribute] = &dynamodb.AttributeValue{
		N: timeToUnixTimestampString(now.Add(time.Minute * 20)),
	}
	return
}

type CreateConnectionFunc func(id string, url string, now time.Time)
type GetAllConnectionsFunc func(limit time.Time) ([]Connection, error)

func CreateConnection(client *dynamodb.DynamoDB, tblName string) CreateConnectionFunc {
	tn := aws.String(tblName)
	return func(id string, url string, now time.Time) {
		_, _ = client.PutItem(&dynamodb.PutItemInput{
			TableName:    tn,
			Item:         makeConnectionsItem(id, url, now),
			ReturnValues: aws.String("NONE"),
		})
		return
	}
}

func GetAllConnections(client *dynamodb.DynamoDB, tblName string) GetAllConnectionsFunc {
	tn := aws.String(tblName)
	return func(limit time.Time) ([]Connection, error) {
		q := expression.Key("pk").Equal(expression.Value(makeConnectionsPK())).
			And(expression.Key("sk").GreaterThan(expression.Value(limit.Unix())))
		builder, err := expression.NewBuilder().WithKeyCondition(q).Build()

		if err != nil {
			return nil, err
		}

		gio, err := client.Query(&dynamodb.QueryInput{
			ExpressionAttributeValues: builder.Values(),
			ExpressionAttributeNames:  builder.Names(),
			KeyConditionExpression:    builder.KeyCondition(),
			TableName:                 tn,
		})

		if err != nil {
			return nil, err
		}

		var slice []connectionItemResult
		err = dynamodbattribute.UnmarshalListOfMaps(gio.Items, &slice)
		if err != nil {
			return nil, err
		}

		var out []Connection
		for _, i := range slice {
			out = append(out, Connection{
				ID:  i.ID,
				Url: i.Url,
			})
		}

		return out, err
	}
}
