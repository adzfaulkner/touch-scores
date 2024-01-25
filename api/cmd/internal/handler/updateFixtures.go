package handler

import (
	"encoding/json"

	"github.com/adzfaulkner/touch-scores/internal/goog"
	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type update struct {
	Value   string `json:"value"`
	Range   string `json:"range"`
	SheetId string `json:"sheetId"`
}

type updateReqBody struct {
	Updates []update `json:"updates"`
}

func handleUpdateFixtures(updateSheetVals goog.UpdateSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB updateReqBody
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	var agg map[string]map[string][][]string

	for _, upd := range reqB.Updates {
		_, ok := agg[upd.SheetId][upd.Range]

		if !ok {
			agg[upd.SheetId][upd.Range] = [][]string{{upd.Value}}
		}
	}

	log.Error("Agg", zap.Reflect("agg", agg))

	return *generateResponse(200, "Acknowledged")
}
