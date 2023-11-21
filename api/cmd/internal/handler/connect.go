package handler

import (
	"github.com/adzfaulkner/touch-scores/internal/persistence"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type logger interface {
	Info(msg string, fields ...zap.Field)
	Error(msg string, fields ...zap.Field)
}

func handleConnect(createConnection persistence.CreateConnectionFunc, log logger, connectionId string, url string) events.APIGatewayProxyResponse {
	log.Info("Websocket connect", zap.String("connectionId", connectionId))

	resp := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "{}",
	}

	createConnection(connectionId, url, time.Now())

	return resp
}
