package handler

import (
	"github.com/aws/aws-lambda-go/events"
)

func handleScape(log logger) events.APIGatewayProxyResponse {
	log.Info("Scraping will commence")

	return *generateResponse(200, "Operation complete")
}
