package fixture_aggregate

import (
	"golang.org/x/exp/maps"
)

func Processor(videoMap map[string]string, pReqs []*ProcessRequest) *ProcessResult {
	teams := map[string]bool{}
	referees := map[string]bool{}
	times := map[string]bool{}
	pitches := map[string]bool{}
	stages := map[string]bool{}

	var aggFixturesByTime ProcessAggregation
	if len(videoMap) > 0 {
		aggFixturesByTime = processTWCSheet(teams, referees, pitches, stages, times, videoMap)
	} else {
		aggFixturesByTime = processEtaSheet(teams, referees, pitches, stages, times)
	}
	
	var scheds []*Schedule

	for _, p := range pReqs {
		var sbds []*ScheduleByDate
		for _, s := range p.Schedules {
			schedulePitchMap := produceSchedulePitchMap(s.Ranges.FixturePitches.Values)
			fbt := aggFixturesByTime(s.Date, s.Ranges.Fixtures.Values, s.Ranges.RefAllocations.Values, s.Ranges.Fixtures.Range, schedulePitchMap)

			sbd := ScheduleByDate{
				Date:            s.Date,
				FixturesByTime:  fbt,
				SlotInfo:        pluckValue(s.Ranges.SlotInfo.Values, 0, 0),
				PlayOffSlotInfo: pluckValue(s.Ranges.PlayOffSlotInfo.Values, 0, 0),
			}

			sbds = append(sbds, &sbd)
		}

		var stands []*PoolStandings
		for _, s := range p.Standings {
			ps := PoolStandings{
				Pool:      s.Label,
				Standings: filterStandings(s.Values),
			}

			stands = append(stands, &ps)
		}

		s := Schedule{
			SheetId:         p.SheetId,
			SchedulesByDate: sbds,
			PoolStandings:   stands,
		}

		scheds = append(scheds, &s)
	}

	res := ProcessResult{
		Schedules: scheds,
		FixturesFilters: &FixtureFilters{
			Teams:    sortStringSlice(maps.Keys(teams)),
			Referees: sortStringSlice(maps.Keys(referees)),
			Times:    sortStringSlice(maps.Keys(times)),
			Pitches:  sortStringSlice(maps.Keys(pitches)),
			Stages:   sortStringSlice(maps.Keys(stages)),
		},
	}

	return &res
}
