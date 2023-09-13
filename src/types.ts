export interface Fixture {
  date: string
  time: string
  competition: string
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

export interface Filters {
  date: string[]
  time: string[]
  stage: string[]
  pitch: string[]
  ref: string[]
  team: string[]
  global: string[]
}

export enum FilterBy {
  Time = 'time',
  Stage = 'stage',
  Pitch = 'pitch',
  Ref = 'ref',
  Team = 'team',
  Global = 'global'
}

export type FilterByFunction = (filterBy: FilterBy, value: string[]) => void
