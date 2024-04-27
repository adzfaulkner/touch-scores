package fixture_aggregate

import (
	"fmt"
	"strings"

	"golang.org/x/exp/maps"
)

func processEtaSheet(teams, referees, pitches, stages map[string]bool, times map[string]bool) ProcessAggregation {
	return func(schedule, refAllocs [][]string, scheduleRange string) []*FixturesByTime {
		schedulePitchMap, refPitchMap, tapOffTimeMap, refTimeMap := generateBaseMaps(schedule, refAllocs)

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
					HomeTeamScoreRange: fmt.Sprintf("%s!%s%d", scheduleSheet, columnToLetter(c+2), scheduleFromCell+(r+1)),
					AwayTeam:           pluckValue(schedule, r+2, c),
					AwayTeamScore:      pluckValue(schedule, r+2, c+1),
					AwayTeamScoreRange: fmt.Sprintf("%s!%s%d", scheduleSheet, columnToLetter(c+2), scheduleFromCell+(r+2)),
					Ref1:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+1, refPitchMap[pitch])),
					Ref1Range:          "",
					Ref2:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+2, refPitchMap[pitch])),
					Ref2Range:          "",
					Ref3:               normalizeRefName(pluckValue(refAllocs, refTimeMap[time]+3, refPitchMap[pitch])),
					Ref3Range:          "",
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

		for _, time := range sortStringSlice(maps.Keys(ttimes)) {
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

func generateBaseMaps(schedule, refAllocs [][]string) (map[int]string, map[string]int, map[int]string, map[string]int) {
	schedulePitchMap := map[int]string{}
	refPitchMap := map[string]int{}
	tapOffTimeMap := map[int]string{}
	refTimeMap := map[string]int{}

	if len(schedule) >= 1 {
		for i := 0; i < len(schedule[0]); i++ {
			if isPitchValue(schedule[0][i]) {
				schedulePitchMap[i] = strings.TrimSpace(schedule[0][i])
			}
		}
	}

	if len(refAllocs) >= 1 {
		for i := 0; i < len(refAllocs[0]); i++ {
			if isPitchValue(refAllocs[0][i]) {
				refPitchMap[strings.TrimSpace(refAllocs[0][i])] = i
			}
		}
	}

	for i := 0; i < len(schedule); i++ {
		if len(schedule[i]) > 0 && isTimeValue(schedule[i][0]) {
			tapOffTimeMap[i] = strings.TrimSpace(schedule[i][0])
		}
	}

	for i := 0; i < len(refAllocs); i++ {
		if len(refAllocs[i]) > 0 && isTimeValue(refAllocs[i][0]) {
			refTimeMap[strings.TrimSpace(refAllocs[i][0])] = i
		}
	}

	return schedulePitchMap, refPitchMap, tapOffTimeMap, refTimeMap
}
