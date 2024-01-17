package handler

import (
	"github.com/adzfaulkner/touch-scores/internal/goog"
	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

func handleUpdateFixtures(updateSheetVals goog.UpdateSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	log.Info("Request body received", zap.String("req body", body))

	return *generateResponse(200, "Acknowledged")
}
