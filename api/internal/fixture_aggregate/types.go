package fixture_aggregate

type testSubject struct {
	Data []*ProcessRequest `json:"data"`
}

type Fixture struct {
	Time               string `json:"time"`
	Stage              string `json:"stage"`
	Pitch              string `json:"pitch"`
	HomeTeam           string `json:"homeTeam"`
	HomeTeamScore      string `json:"homeTeamScore"`
	HomeTeamScoreRange string `json:"HomeTeamScoreRange"`
	AwayTeam           string `json:"awayTeam"`
	AwayTeamScore      string `json:"awayTeamScore"`
	AwayTeamScoreRange string `json:"awayTeamScoreRange"`
	Ref1               string `json:"ref1"`
	Ref1Range          string `json:"ref1Range"`
	Ref2               string `json:"ref2"`
	Ref2Range          string `json:"ref2Range"`
	Ref3               string `json:"ref3"`
	Ref3Range          string `json:"ref3Range"`
}

type FixturesByTime struct {
	Time     string     `json:"time"`
	Fixtures []*Fixture `json:"fixtures"`
}

type ScheduleByDate struct {
	Date            string            `json:"date"`
	FixturesByTime  []*FixturesByTime `json:"fixturesByTime"`
	SlotInfo        string            `json:"slotInfo"`
	PlayOffSlotInfo string            `json:"playOffSlotInfo"`
}

type PoolStandings struct {
	Pool      string     `json:"pool"`
	Standings [][]string `json:"standings"`
}

type FixtureFilters struct {
	Teams    []string `json:"teams"`
	Referees []string `json:"referees"`
	Times    []string `json:"times"`
	Pitches  []string `json:"pitches"`
	Stages   []string `json:"stages"`
}

type Schedule struct {
	SheetId         string            `json:"sheetId"`
	SchedulesByDate []*ScheduleByDate `json:"schedulesByDate"`
	PoolStandings   []*PoolStandings  `json:"poolStandings"`
}

type ProcessResult struct {
	Schedules       []*Schedule     `json:"schedules"`
	FixturesFilters *FixtureFilters `json:"fixtureFilters"`
}

type ProcessAggregation func(schedule, refAllocs [][]string, scheduleRange string, schedulePitchMap map[int]string) []*FixturesByTime

type ProcessRangeValues struct {
	Range  string     `json:"range"`
	Values [][]string `json:"values"`
}

type ProcessStandingsRangeValues struct {
	Range  string     `json:"range"`
	Label  string     `json:"label"`
	Values [][]string `json:"values"`
}

type ProcessScheduleRanges struct {
	Fixtures        *ProcessRangeValues `json:"fixtures"`
	FixturePitches  *ProcessRangeValues `json:"fixturePitches"`
	SlotInfo        *ProcessRangeValues `json:"slotInfo"`
	PlayOffSlotInfo *ProcessRangeValues `json:"playOffSlotInfo"`
	RefAllocations  *ProcessRangeValues `json:"refAllocations"`
}

type ProcessSchedulesByDate struct {
	Date   string                 `json:"date"`
	Ranges *ProcessScheduleRanges `json:"ranges"`
}

type ProcessRequest struct {
	SheetId   string                         `json:"sheetId"`
	Schedules []*ProcessSchedulesByDate      `json:"schedules"`
	Standings []*ProcessStandingsRangeValues `json:"standings"`
}
