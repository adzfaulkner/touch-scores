export interface Fixture {
    time: string
    stage: string
    pitch: string
    homeTeam: string
    homeTeamScore: string
    homeTeamScoreRange: string
    awayTeam: string
    awayTeamScore: string
    awayTeamScoreRange: string
    ref1: string
    ref1Range: string
    ref2: string
    ref2Range: string
    ref3: string
    ref3Range: string
}

export interface FixtureByTime {
    time: string
    fixtures: Fixture[]
}

export interface ScheduleByDate {
    date: string
    fixturesByTime: FixtureByTime[]
    slotInfo: string
    playOffSlotInfo: string
}

export interface FixtureFilters {
    teams: string[]
    referees: string[]
    times: string[]
    pitches: string[]
    stages: string[]
}

export interface PoolStanding {
    pool: string
    standings: string[][]
}

export interface FixturesRetrieved {
    sheetId: string
    schedulesByDate: ScheduleByDate[]
    poolStandings: PoolStanding[]
}