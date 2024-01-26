package main

import (
	"context"
	"encoding/base64"
	"github.com/adzfaulkner/touch-scores/cmd/internal/handler"
	"github.com/adzfaulkner/touch-scores/internal/goog"
	"github.com/adzfaulkner/touch-scores/internal/logger"
	"github.com/adzfaulkner/touch-scores/internal/persistence"
	"github.com/adzfaulkner/touch-scores/internal/wsconnection"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/ssm"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

func main() {
	ctx := context.Background()

	region := os.Getenv("AWS_REGION")
	tblName := os.Getenv("DB_TBL_NAME")

	log, err := logger.NewHandler()

	if err != nil {
		panic(err.Error())
	}

	awsConfig := aws.Config{
		Region: aws.String(region),
	}

	sess, _ := session.NewSession(&awsConfig)

	ssmsvc := ssm.New(sess, &awsConfig)

	gcrdsenc := getSmmParamVal(ssmsvc, "/TouchScores/GOOGLE_CREDS")

	gcrds, err := base64.StdEncoding.DecodeString(gcrdsenc)

	if err != nil {
		panic(err)
	}

	db := dynamodb.New(sess)

	createConnection := persistence.CreateConnection(db, tblName)
	getAllConnections := persistence.GetAllConnections(db, tblName)

	postConnection := wsconnection.PostConnection(sess)

	config, err := google.JWTConfigFromJSON(gcrds, "https://www.googleapis.com/auth/spreadsheets")

	if err != nil {
		panic(err.Error())
	}

	// create client with config and context
	client := config.Client(ctx)

	srv, err := sheets.NewService(
		ctx,
		option.WithHTTPClient(client),
	)

	if err != nil {
		panic(err.Error())
	}

	getSheetVals := goog.GetSheetValues(srv)
	updateSheetVals := goog.UpdateSheetValues(srv)

	lambda.Start(handler.Handle(createConnection, getAllConnections, postConnection, getSheetVals, updateSheetVals, log))
}

func getSmmParamVal(ssmsvc *ssm.SSM, key string) string {
	param, err := ssmsvc.GetParameter(&ssm.GetParameterInput{
		Name:           aws.String(key),
		WithDecryption: aws.Bool(true),
	})

	if err != nil {
		panic(err.Error())
	}

	return *param.Parameter.Value
}
