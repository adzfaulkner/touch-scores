package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

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
	Token   string   `json:"token"`
	Updates []update `json:"updates"`
}

type updateRespBody struct {
	Event   string `json:"event"`
	Success bool   `json:"success"`
}

func handleUpdateFixtures(updateSheetVals goog.UpdateSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB updateReqBody
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	if !validatedToken(log)(reqB.Token) {
		log.Error("Invalid token received", zap.Error(err))
		return *generateResponse(401, "Unauthorized")
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

	success := true
	for sid, v := range agg {
		res, err := updateSheetVals(sid, v)

		if err != nil {
			log.Error("Error updating sheet", zap.Error(err))
			success = false
			continue
		}

		log.Info("Sheet update result", zap.Reflect("res", res))
	}

	resB := updateRespBody{
		Event:   "FIXTURES_UPDATED",
		Success: success,
	}

	b, _ := json.Marshal(resB)

	return *generateResponse(200, string(b))
}

func validatedToken(log logger) func(token string) bool {
	return func(token string) bool {
		requestURL := fmt.Sprintf("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=%s", token)
		res, err := http.NewRequest(http.MethodGet, requestURL, nil)

		if err != nil {
			log.Error("look up token response error", zap.Error(err))
			return true
		}

		log.Info("look up token response", zap.Reflect("res", res), zap.String("token", token))
		return true
	}
}
