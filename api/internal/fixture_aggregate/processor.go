package fixture_aggregate

import (
	"golang.org/x/exp/maps"
)

func Processor(p *ProcessRequest) *ProcessResult {
	teams := map[string]bool{}
	referees := map[string]bool{}
	times := map[string]bool{}
	pitches := map[string]bool{}
	stages := map[string]bool{}

	aggFixturesByTime := processEtaSheet(teams, referees, pitches, stages, times)

	var sbds []*ScheduleByDate
	for _, s := range p.Schedules {
		fbt := aggFixturesByTime(s.Ranges.Fixtures.Values, s.Ranges.RefAllocations.Values, s.Ranges.Fixtures.Range)

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
		pool, _ := extractSheetAndReadFromFromRange(s.Range)

		ps := PoolStandings{
			Pool:      pool,
			Standings: filterStandings(s.Values),
		}

		stands = append(stands, &ps)
	}

	res := ProcessResult{
		SheetId:         p.SheetId,
		SchedulesByDate: sbds,
		FixturesFilters: &FixtureFilters{
			Teams:    sortStringSlice(maps.Keys(teams)),
			Referees: sortStringSlice(maps.Keys(referees)),
			Times:    sortStringSlice(maps.Keys(times)),
			Pitches:  sortStringSlice(maps.Keys(pitches)),
			Stages:   sortStringSlice(maps.Keys(stages)),
		},
		PoolStandings: stands,
	}

	return &res
}
