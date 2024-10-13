package fixture_aggregate

import (
	"fmt"
	"golang.org/x/exp/maps"
)

func processEtaSheet(teams, referees, pitches, stages, times map[string]bool) ProcessAggregation {
	return func(date string, schedule, refAllocs [][]string, scheduleRange string, schedulePitchMap map[int]string) []*FixturesByTime {
		tapOffTimeMap := produceTapOffTimeMap(schedule)
		refPitchMap := produceRefPitchMap(refAllocs)
		refTimeMap := produceRefTimeMap(refAllocs)

		var stage string
		timeFixsMap := map[string]map[string]*Fixture{}
		ttimes := map[string]bool{}
		ppitches := map[string]bool{}

		scheduleSheet, scheduleFromCell := extractSheetAndReadFromFromRange(scheduleRange)

		for r, time := range tapOffTimeMap {
			for c, pitch := range schedulePitchMap {
				if stage = pluckValue(schedule, r, c); stage == "" {
					continue
				}

				fix := Fixture{
					Time:               time,
					Stage:              stage,
					Pitch:              pitch,
					HomeTeam:           pluckValue(schedule, r+1, c),
					HomeTeamScore:      pluckValue(schedule, r+1, c+1),
					HomeTeamScoreRange: fmt.Sprintf("%s!%s%d", scheduleSheet, columnToLetter(c+1), scheduleFromCell+(r+1)),
					AwayTeam:           pluckValue(schedule, r+2, c),
					AwayTeamScore:      pluckValue(schedule, r+2, c+1),
					AwayTeamScoreRange: fmt.Sprintf("%s!%s%d", scheduleSheet, columnToLetter(c+1), scheduleFromCell+(r+2)),
					Ref1:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+1, refPitchMap[pitch])),
					Ref1Range:          "",
					Ref2:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+2, refPitchMap[pitch])),
					Ref2Range:          "",
					Ref3:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+3, refPitchMap[pitch])),
					Ref3Range:          "",
					VideoUrl:           "",
				}

				if _, ok := timeFixsMap[fix.Time]; !ok {
					timeFixsMap[fix.Time] = map[string]*Fixture{}
				}

				timeFixsMap[fix.Time][fix.Pitch] = &fix

				addValToFiler(teams, fix.HomeTeam)
				addValToFiler(teams, fix.AwayTeam)
				addValToFiler(referees, fix.Ref1)
				addValToFiler(referees, fix.Ref2)
				addValToFiler(referees, fix.Ref3)
				addValToFiler(ttimes, fix.Time)
				addValToFiler(ppitches, fix.Pitch)
				addValToFiler(stages, fix.Stage)
			}
		}

		var fixsByTime []*FixturesByTime

		for _, time := range sortTimes(maps.Keys(ttimes)) {
			var fixs []*Fixture
			times[time] = true

			for _, pitch := range sortStringSlice(maps.Keys(ppitches)) {
				pitches[pitch] = true

				if _, ok := timeFixsMap[time][pitch]; ok {
					fixs = append(fixs, timeFixsMap[time][pitch])
				}
			}

			fixByTime := FixturesByTime{
				Time:     time,
				Fixtures: fixs,
			}

			fixsByTime = append(fixsByTime, &fixByTime)
		}

		return fixsByTime
	}
}
