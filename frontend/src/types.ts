import type { RemovableRef } from '@vueuse/core'
import type { DateTime } from 'luxon'

import type { FixturesRetrieved, FixtureByTime, FixtureFilters, PoolStanding } from './types-api'

export interface SheetConfig {
  sheetId: string
  schedule: {
    date: string,
    ranges: {
      fixtures: string,
      fixturePitches: string
      refAllocations: null | string
      slotInfo: null | string
      playOffSlotInfo: null | string
    }
  }[]
  standingRanges: {
    label: string
    range: string
  }[]
  competition: string
  label: string
}

export interface FixtureState {
  initialized: boolean
  sheetIdFixturesRetrievedMap: Map<string, number>
  fixturesRetrieved: FixturesRetrieved[]
  fixturesRetrievedFiltered: FixturesRetrieved[]
}

export interface FilterState {
  filteringInProgress: boolean
  values: FixtureFilters
  globalValue: RemovableRef<string>
  filters: RemovableRef<Filters>
}

export interface StandingsState {
  standings: StandingsBySheet[]
  sheetIdStandingsMap: Map<string, number>
}

export interface NotificationState {
  notification: Notification,
}

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
  videoUrl: string
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

export interface FixturesBySheetDate {
  comp: string
  sheetId: string
  date: DateTime
  isToday: boolean
  totalCount: number
  fixturesByTime: FixtureByTime[]
  slotInfo: string
  playOffSlotInfo: string
}

export interface StandingsBySheet {
  sheetId: string
  competition: string
  standings: PoolStanding[]
}

export interface SheetUpdate {
  sheetId: string
  value: string
  range: string
}