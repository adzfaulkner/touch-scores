package wsconnection

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
)

type PostConnectionFunc func(url string, connectionId string, data []byte) error

func PostConnection(sess *session.Session) PostConnectionFunc {
	return func(url string, connectionId string, data []byte) error {
		apigw := apigatewaymanagementapi.New(sess, &aws.Config{
			Endpoint: aws.String(url),
		})

		_, err := apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(connectionId),
			Data:         data,
		})

		return err
	}
}
