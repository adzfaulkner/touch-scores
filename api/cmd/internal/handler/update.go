package handler

import (
	"encoding/json"
	"github.com/adzfaulkner/touch-scores/internal/persistence"
	"github.com/adzfaulkner/touch-scores/internal/wsconnection"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type requestBody struct {
	SpreadsheetId string `json:"spreadsheetId"`
}

type responseBodyData struct {
	SpreadsheetId string `json:"spreadsheetId"`
}

type responseBody struct {
	Event string           `json:"event"`
	Data  responseBodyData `json:"data"`
}

func handleUpdate(getAllConnections persistence.GetAllConnectionsFunc, postConnection wsconnection.PostConnectionFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB requestBody
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	resB := responseBody{
		Event: "UPDATE_RECEIVED",
		Data: responseBodyData{
			SpreadsheetId: reqB.SpreadsheetId,
		},
	}

	b, _ := json.Marshal(resB)

	now := time.Now()

	cs, _ := getAllConnections(now.AddDate(0, 0, -1))

	for _, c := range cs {
		log.Info("Posting to connections", zap.String("cid", c.ID), zap.String("url", c.Url))
		err = postConnection(c.Url, c.ID, b)
		log.Info("error", zap.Error(err))
	}

	return *generateResponse(200, string(b))
}

func generateResponse(sc int, body string) *events.APIGatewayProxyResponse {
	headers := map[string]string{}
	headers["Content-Type"] = "application/json"

	return &events.APIGatewayProxyResponse{
		Body:       body,
		StatusCode: sc,
		Headers:    headers,
	}
}
