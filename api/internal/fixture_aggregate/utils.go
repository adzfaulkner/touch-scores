package fixture_aggregate

import (
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

const DateRegexp = "(?i)^MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY"
const TimeRegexp = "^\\d+:\\d+$"
const PitchRegexp = "(?i)^Field|Pitch|AGP|FOD|Roadside|Farside"
const yearIncluded = "\\d{2,4}$"
const thSearch = "(?i)(\\d+)(st|nd|rd|th)"
const extractSheetAndReadFrom = "^(([^!]+)!)?[A-Z]+([^:]+)"

func isDateValue(subject string) bool {
	res, _ := regexp.MatchString(DateRegexp, subject)
	return res
}

func isTimeValue(subject string) bool {
	res, _ := regexp.MatchString(TimeRegexp, subject)
	return res
}

func isPitchValue(subject string) bool {
	res, _ := regexp.MatchString(PitchRegexp, subject)
	return res
}

func columnToLetter(column int) string {
	column++
	var i int
	letter := ""

	for column > 0 {
		i = (column - 1) % 26
		letter = fmt.Sprintf("%s%s", string(rune('A'+i)), letter)
		column = (column - i - 1) / 26
	}

	return letter
}

func normalizerDate(year string) func(subject string) string {
	return func(subject string) string {
		res, _ := regexp.MatchString(yearIncluded, subject)

		if !res {
			subject = fmt.Sprintf("%s %s", subject, year)
		}

		reg := regexp.MustCompile(thSearch)
		return reg.ReplaceAllString(subject, "${1}")
	}
}

func normalizeRefName(subject string) string {
	return strings.ToUpper(subject)
}

func pluckValue(sl [][]string, r int, c int) string {
	if len(sl) <= r || len(sl[r]) <= c {
		return ""
	}

	return strings.TrimSpace(sl[r][c])
}

func extractSheetAndReadFromFromRange(subject string) (string, int) {
	re := regexp.MustCompile(extractSheetAndReadFrom)
	segs := re.FindStringSubmatch(subject)

	if len(segs) < 3 {
		return "", -1
	}

	if len(segs) < 4 {
		i, _ := strconv.Atoi(segs[2])
		return "", i
	}

	i, _ := strconv.Atoi(segs[3])
	return segs[2], i
}

func sortStringSlice(vals []string) []string {
	sort.Sort(sort.StringSlice(vals))
	return vals
}

func addValToFiler(m map[string]bool, v string) {
	if v != "" {
		m[v] = true
	}
}

func produceSchedulePitchMap(schedule [][]string) map[int]string {
	schedulePitchMap := map[int]string{}

	if len(schedule) >= 1 {
		for i := 0; i < len(schedule[0]); i++ {
			if isPitchValue(schedule[0][i]) {
				schedulePitchMap[i] = strings.TrimSpace(schedule[0][i])
			}
		}
	}

	return schedulePitchMap
}

func produceRefPitchMap(refAllocs [][]string) map[string]int {
	refPitchMap := map[string]int{}

	if len(refAllocs) >= 1 {
		for i := 0; i < len(refAllocs[0]); i++ {
			if isPitchValue(refAllocs[0][i]) {
				refPitchMap[strings.TrimSpace(refAllocs[0][i])] = i
			}
		}
	}

	return refPitchMap
}

func produceTapOffTimeMap(schedule [][]string) map[int]string {
	tapOffTimeMap := map[int]string{}

	for i := 0; i < len(schedule); i++ {
		if len(schedule[i]) > 0 && isTimeValue(schedule[i][0]) {
			tapOffTimeMap[i] = strings.TrimSpace(schedule[i][0])
		}
	}

	return tapOffTimeMap
}

func produceRefTimeMap(refAllocs [][]string) map[string]int {
	refTimeMap := map[string]int{}

	for i := 0; i < len(refAllocs); i++ {
		if len(refAllocs[i]) > 0 && isTimeValue(refAllocs[i][0]) {
			refTimeMap[strings.TrimSpace(refAllocs[i][0])] = i
		}
	}

	return refTimeMap
}
