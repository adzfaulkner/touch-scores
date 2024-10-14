package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

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
	Message string `json:"message"`
}

func handleUpdateFixtures(updateSheetVals goog.UpdateSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB updateReqBody
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	if !validatedToken(log)(reqB.Token) {
		resB := updateRespBody{
			Event:   "FIXTURES_UPDATED",
			Success: false,
			Message: "Unauthenticated",
		}

		b, _ := json.Marshal(resB)

		return *generateResponse(401, string(b))
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
		Message: "",
	}

	b, _ := json.Marshal(resB)

	return *generateResponse(200, string(b))
}

type resp struct {
	ErrorDescription string `json:"error_description"`
}

func validatedToken(log logger) func(token string) bool {
	return func(token string) bool {
		requestURL := fmt.Sprintf("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=%s", token)
		req, _ := http.NewRequest(http.MethodGet, requestURL, nil)

		cl := http.Client{
			Timeout: time.Second * 2,
		}

		res, err := cl.Do(req)

		if err != nil {
			log.Error("look up token response error", zap.Error(err))
			return false
		}

		body, _ := io.ReadAll(res.Body)

		rp := resp{}
		err = json.Unmarshal(body, &rp)

		if err != nil {
			log.Error("look up token response error", zap.Error(err))
			return false
		}

		if rp.ErrorDescription != "" {
			return false
		}

		return true
	}
}
