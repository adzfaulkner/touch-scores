package fixture_aggregate

import (
	"fmt"
	"golang.org/x/exp/maps"
	"strings"
	"unicode"
)

func processTWCSheet(teams, referees, pitches, stages, times map[string]bool, vidMap map[string]string) ProcessAggregation {
	return func(date string, schedule, refAllocs [][]string, scheduleRange string, schedulePitchMap map[int]string) []*FixturesByTime {
		tapOffTimeMap := produceTapOffTimeMap(schedule)

		var stage string
		timeFixsMap := map[string]map[string]*Fixture{}
		ttimes := map[string]bool{}
		ppitches := map[string]bool{}

		for r, time := range tapOffTimeMap {
			for c, pitch := range schedulePitchMap {
				if stage = pluckValue(schedule, r, c); stage == "" {
					continue
				}

				videoUrl := ""
				if vu, ok := vidMap[fmt.Sprintf("%s, %s, %s", date, time, ucfirst(pitch))]; ok {
					videoUrl = vu
				}

				fix := Fixture{
					Time:               time,
					Stage:              stage,
					Pitch:              pitch,
					HomeTeam:           pluckValue(schedule, r+1, c),
					HomeTeamScore:      pluckValue(schedule, r+1, c+1),
					HomeTeamScoreRange: "",
					AwayTeam:           pluckValue(schedule, r+2, c),
					AwayTeamScore:      pluckValue(schedule, r+2, c+1),
					AwayTeamScoreRange: "",
					Ref1:               "",
					Ref1Range:          "",
					Ref2:               "",
					Ref2Range:          "",
					Ref3:               "",
					Ref3Range:          "",
					VideoUrl:           videoUrl,
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

func ucfirst(str string) string {
	str = strings.ToLower(str)

	for _, v := range str {
		u := string(unicode.ToUpper(v))
		return u + str[len(u):]
	}

	return ""
}
