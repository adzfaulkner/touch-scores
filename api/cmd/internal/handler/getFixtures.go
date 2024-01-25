package handler

import (
	"encoding/json"
	"github.com/adzfaulkner/touch-scores/cmd/internal/gsheets"
	"github.com/adzfaulkner/touch-scores/internal/goog"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type reqBodyRanges struct {
	Schedule  string   `json:"schedule"`
	Standings []string `json:"standings"`
	SlotInfo  string   `json:"slotInfo"`
}

type reqConfig struct {
	SheetId string        `json:"sheetId"`
	Ranges  reqBodyRanges `json:"ranges"`
}

type reqBody struct {
	Configs []reqConfig `json:"configs"`
}

type respBodyDataRange struct {
	Range  string     `json:"range"`
	Values [][]string `json:"values"`
}

type respBodyDataRanges struct {
	Schedule  respBodyDataRange   `json:"schedule"`
	Standings []respBodyDataRange `json:"standings"`
	SlotInfo  respBodyDataRange   `json:"slotInfo"`
}

type respBodyData struct {
	SheetId string             `json:"sheetId"`
	Ranges  respBodyDataRanges `json:"ranges"`
}

type respBody struct {
	Event string         `json:"event"`
	Data  []respBodyData `json:"data"`
}

func handleGetFixtures(getSheetVals goog.GetSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB reqBody
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	log.Info("ReqBs", zap.Reflect("reqBs", reqB))

	var data []respBodyData

	for _, reqC := range reqB.Configs {
		ranges := []string{reqC.Ranges.Schedule, reqC.Ranges.SlotInfo}

		for _, r := range reqC.Ranges.Standings {
			ranges = append(ranges, r)
		}

		vs, err := gsheets.GetValues(getSheetVals, reqC.SheetId, ranges)

		if err != nil {
			log.Error("Error received whilst querying google sheets", zap.Error(err))
			return *generateResponse(500, "Check logs")
		}

		var standings []respBodyDataRange
		for _, r := range reqC.Ranges.Standings {
			standings = append(standings, respBodyDataRange{
				Range:  r,
				Values: vs.Values[r],
			})
		}

		data = append(data, respBodyData{
			SheetId: vs.SpreadsheetId,
			Ranges: respBodyDataRanges{
				Schedule: respBodyDataRange{
					Range:  reqC.Ranges.Schedule,
					Values: vs.Values[reqC.Ranges.Schedule],
				},
				Standings: standings,
				SlotInfo: respBodyDataRange{
					Range:  reqC.Ranges.SlotInfo,
					Values: vs.Values[reqC.Ranges.SlotInfo],
				},
			},
		})
	}

	resB := respBody{
		Event: "FIXTURES_RETRIEVED",
		Data:  data,
	}

	b, _ := json.Marshal(resB)

	return *generateResponse(200, string(b))
}
