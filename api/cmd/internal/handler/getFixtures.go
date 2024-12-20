package handler

import (
	"encoding/json"

	"github.com/adzfaulkner/touch-scores/cmd/internal/gsheets"
	"github.com/adzfaulkner/touch-scores/internal/fixture_aggregate"
	"github.com/adzfaulkner/touch-scores/internal/goog"
	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/zap"
)

type reqBodyConfig struct {
	SheetId  string `json:"sheetId"`
	Schedule []struct {
		Date   string `json:"date"`
		Ranges struct {
			Fixtures        string `json:"fixtures"`
			FixturePitches  string `json:"fixturePitches"`
			SlotInfo        string `json:"slotInfo"`
			PlayOffSlotInfo string `json:"playOffSlotInfo"`
			RefAllocations  string `json:"refAllocations"`
		} `json:"ranges"`
	} `json:"schedule"`
	StandingRanges []struct {
		Label string `json:"label"`
		Range string `json:"range"`
	} `json:"standingRanges"`
}

type reqBodyGetFixtures struct {
	Configs []reqBodyConfig `json:"configs"`
}

type respBodyGetFixtures struct {
	Event string                           `json:"event"`
	Data  *fixture_aggregate.ProcessResult `json:"data"`
}

func handleGetFixtures(getSheetVals goog.GetSheetValuesFunc, log logger, body string) events.APIGatewayProxyResponse {
	var reqB reqBodyGetFixtures
	err := json.Unmarshal([]byte(body), &reqB)

	if err != nil {
		log.Error("Unable to decode request body", zap.Error(err))
		return *generateResponse(500, "Check logs")
	}

	var pReqs []*fixture_aggregate.ProcessRequest

	for _, reqC := range reqB.Configs {
		ranges := defineQryRanges(&reqC)

		vs, err := gsheets.GetValues(getSheetVals, reqC.SheetId, ranges)

		if err != nil {
			log.Error("Error received whilst querying google sheets", zap.Error(err))
			return *generateResponse(500, "Check logs")
		}

		pReq := buildProcessRequest(vs, &reqC)

		pReqs = append(pReqs, pReq)
	}

	tmp, _ := json.Marshal(pReqs)
	
	log.Info("fetched from google", zap.String("pReqs", string(tmp)))

	pRes := fixture_aggregate.Processor(pReqs)

	resB := respBodyGetFixtures{
		Event: "FIXTURES_RETRIEVED",
		Data:  pRes,
	}

	b, _ := json.Marshal(resB)

	return *generateResponse(200, string(b))
}

func defineQryRanges(c *reqBodyConfig) []string {
	var rgs []string

	add := func(v string) {
		if v != "" {
			rgs = append(rgs, v)
		}
	}

	for _, sched := range c.Schedule {
		add(sched.Ranges.Fixtures)
		add(sched.Ranges.FixturePitches)

		if sched.Ranges.RefAllocations != "" {
			add(sched.Ranges.RefAllocations)
		}

		if sched.Ranges.SlotInfo != "" {
			add(sched.Ranges.SlotInfo)
		}

		if sched.Ranges.PlayOffSlotInfo != "" {
			add(sched.Ranges.PlayOffSlotInfo)
		}
	}

	for _, sr := range c.StandingRanges {
		add(sr.Range)
	}

	return rgs
}

func buildProcessRequest(gVals *gsheets.Values, c *reqBodyConfig) *fixture_aggregate.ProcessRequest {
	var stands []*fixture_aggregate.ProcessStandingsRangeValues
	for _, sr := range c.StandingRanges {
		prv := fixture_aggregate.ProcessStandingsRangeValues{
			Range:  sr.Range,
			Label:  sr.Label,
			Values: gVals.Values[sr.Range],
		}

		stands = append(stands, &prv)
	}

	var scheds []*fixture_aggregate.ProcessSchedulesByDate
	for _, s := range c.Schedule {
		rs := fixture_aggregate.ProcessScheduleRanges{
			Fixtures: &fixture_aggregate.ProcessRangeValues{
				Range:  s.Ranges.Fixtures,
				Values: gVals.Values[s.Ranges.Fixtures],
			},
			FixturePitches: &fixture_aggregate.ProcessRangeValues{
				Range:  s.Ranges.FixturePitches,
				Values: gVals.Values[s.Ranges.FixturePitches],
			},
			RefAllocations: &fixture_aggregate.ProcessRangeValues{
				Range:  s.Ranges.RefAllocations,
				Values: gVals.Values[s.Ranges.RefAllocations],
			},
			SlotInfo: &fixture_aggregate.ProcessRangeValues{
				Range:  s.Ranges.SlotInfo,
				Values: gVals.Values[s.Ranges.SlotInfo],
			},
			PlayOffSlotInfo: &fixture_aggregate.ProcessRangeValues{
				Range:  s.Ranges.PlayOffSlotInfo,
				Values: gVals.Values[s.Ranges.PlayOffSlotInfo],
			},
		}

		psbd := fixture_aggregate.ProcessSchedulesByDate{
			Date:   s.Date,
			Ranges: &rs,
		}

		scheds = append(scheds, &psbd)
	}

	pReq := fixture_aggregate.ProcessRequest{
		SheetId:   c.SheetId,
		Schedules: scheds,
		Standings: stands,
	}

	return &pReq
}
