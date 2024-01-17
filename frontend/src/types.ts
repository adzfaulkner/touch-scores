import type { RemovableRef } from '@vueuse/core'
import type { DateTime } from 'luxon'

export interface SheetConfig {
  sheetId: string
  date: string
  ranges: {
    schedule: string
    standings: string[]
    refAllocations: null | string
    slotInfo: string
  }
  competition: string
}

export interface FixtureParamsBySpreadsheet {
  fixtures: Map<string, Map<string, Fixture[]>>
  filtered: Map<string, Map<string, Fixture[]>>
  competition: Competition
}

export interface FixtureState {
  initialized: boolean,
  events: Map<string, FixtureParamsBySpreadsheet>
  competitions: Set<string>
  totalFixtures: Map<string, number>
  dates: Set<string>
  times: Set<string>
  pitches:Set<string>
  stages: Set<string>
  teams: Set<string>
  refs: Set<string>
  competition: Set<string>
}

export interface FilterState {
  filteringInProgress: boolean
  globalValue: RemovableRef<string>
  filters: RemovableRef<Filters>
}

export interface StandingsState {
  standings: {
    range: string,
    values: string[][],
  }[]
}

export interface NotificationState {
  notification: Notification,
}

export interface Competition {
  sheetId: string
  name: string
  info: string
}

export interface Fixture {
  date: string
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

export interface Standing {
  position: number
  team: string
  points: number
  tdDiff: number
  tdFor: number
}

export interface Notification {
  success: boolean | null
  message: string | null
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

export interface FixturesByCompetitionDate {
  date: DateTime
  isToday: boolean
  competition: Competition
  totalCount: number
  times: Map<string, Fixture[]>
}

export interface SheetUpdate {
  sheetId: string
  value: string
  range: string
}