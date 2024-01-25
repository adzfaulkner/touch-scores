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

	agg := map[string]map[string][][]interface{}{}

	for _, upd := range reqB.Updates {
		_, ok := agg[upd.SheetId]

		if !ok {
			agg[upd.SheetId] = map[string][][]interface{}{}
		}

		vv := make([]interface{}, 1)
		vv[0] = upd.Value

		v := make([][]interface{}, 1)
		v[0] = vv
		
		agg[upd.SheetId][upd.Range] = v
	}

	for sid, v := range agg {
		res, err := updateSheetVals(sid, v)

		if err != nil {
			log.Error("Error updating sheet", zap.Error(err))
			continue
		}

		log.Info("Sheet update result", zap.Reflect("res", res))
	}

	return *generateResponse(200, "Updated")
}
