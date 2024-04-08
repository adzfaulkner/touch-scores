package handler

import (
	"encoding/json"
	"fmt"
	"github.com/adzfaulkner/touch-scores/internal/goog"
	"github.com/adzfaulkner/touch-scores/internal/persistence"
	"github.com/adzfaulkner/touch-scores/internal/wsconnection"
	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type msgBody struct {
	Action string `json:"action"`
}

func Handle(createConnection persistence.CreateConnectionFunc, getAllConnections persistence.GetAllConnectionsFunc, postConnection wsconnection.PostConnectionFunc, getSheetVals goog.GetSheetValuesFunc, updateSheetVals goog.UpdateSheetValuesFunc, log logger) func(r map[string]interface{}) (events.APIGatewayProxyResponse, error) {
	return func(r map[string]interface{}) (events.APIGatewayProxyResponse, error) {
		log.Info("request", zap.Reflect("r", r))

		res := handleWebsocketProxyRequest(createConnection, getSheetVals, updateSheetVals, log, r)

		if res != nil {
			return *res, nil
		}

		res = handleProxyRequest(getAllConnections, postConnection, log, r)

		if res != nil {
			return *res, nil
		}

		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "No request handler found",
		}, fmt.Errorf("no request handler found")
	}
}

func handleWebsocketProxyRequest(createConnection persistence.CreateConnectionFunc, getSheetVals goog.GetSheetValuesFunc, updateSheetVals goog.UpdateSheetValuesFunc, log logger, r map[string]interface{}) *events.APIGatewayProxyResponse {
	rc, ok := r["requestContext"].(map[string]interface{})

	if !ok {
		return nil
	}

	et, ok := rc["eventType"]

	if ok {
		switch et.(string) {
		case "CONNECT":
			cid, _ := rc["connectionId"].(string)
			callbackurl := fmt.Sprintf("https://%s/%s", rc["domainName"].(string), rc["stage"].(string))
			ret := handleConnect(createConnection, log, cid, callbackurl)

			return &ret
		case "DISCONNECT":
			return &events.APIGatewayProxyResponse{
				StatusCode: 200,
			}
		case "MESSAGE":
			b := r["body"].(string)

			var mb msgBody
			err := json.Unmarshal([]byte(b), &mb)

			if err != nil {
				return &events.APIGatewayProxyResponse{
					StatusCode: 400,
					Body:       "Invalid message body received",
				}
			}

			var ret events.APIGatewayProxyResponse

			switch mb.Action {
			case "UPDATE_FIXTURES":
				ret = handleUpdateFixtures(updateSheetVals, log, b)
				break
			default:
				ret = handleGetFixtures(getSheetVals, log, b)
			}

			return &ret
		}
	}

	return nil
}

func handleProxyRequest(getAllConnections persistence.GetAllConnectionsFunc, postConnection wsconnection.PostConnectionFunc, log logger, r map[string]interface{}) *events.APIGatewayProxyResponse {
	res, ok := r["resource"]

	if !ok {
		return nil
	}

	switch res.(string) {
	case "/update":
		body := r["body"].(string)
		ret := handleUpdate(getAllConnections, postConnection, log, body)
		return &ret
	case "/get":
		log.Info("get", zap.Reflect("r", r))
		return &events.APIGatewayProxyResponse{
			Body:       "Retrieved",
			StatusCode: 200,
		}
	}

	return nil
}
