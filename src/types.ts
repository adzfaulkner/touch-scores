import type { RemovableRef } from '@vueuse/core'

export interface SheetConfig {
  sheetId: string,
  date: string,
  ranges: {
    schedule: string,
    standings: string[],
    refAllocations: null|string,
  }
  competition: string
}

export interface FixtureState {
  fixtures: Fixture[]
  filtered: Fixture[]
  dates: string[]
  times: string[]
  pitches: string[]
  competitions: string[]
  stages: string[]
  teams: string[]
  refs: string[]
  dateCompetitionMap: Map<string, string>
}

export interface FilterState {
  filteringInProgress: boolean
  globalValue: RemovableRef<string>
  filters: RemovableRef<Filters>
}

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

export interface Standing {
  position: number,
  team: string,
  points: number,
  tdDiff: number,
  tdFor: number,
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
