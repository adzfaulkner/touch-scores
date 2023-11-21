import type { Filters, Fixture } from '@/types'

import { DateTime } from 'luxon'
import * as aggregators from '@/support/fixture'

const dateRegex = /^MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY/i
const timeRegex = /^\d+:\d+$/
const pitchRegex = /^Field|Pitch|AGP /i

const isDateValue = (
  (dateRegex: RegExp) =>
  (subject: string): boolean => {
    return dateRegex.test(subject)
  }
)(dateRegex)

const isTimeValue = (
  (timeRegex: RegExp) =>
  (subject: string): boolean => {
    return timeRegex.test(subject)
  }
)(timeRegex)

const isPitchValue = (
  (pitchRegex: RegExp) =>
  (subject: string): boolean => {
    return pitchRegex.test(subject)
  }
)(pitchRegex)

export type Aggregated = (
  dates: Set<string>,
  times: Set<string>,
  pitches: Set<string>,
  fixtures: Map<string, Map<string, Fixture[]>>,
  teams: Set<string>,
  stages: Set<string>,
  refs: Set<string>,
  dateFixtureCount: Map<string, number>,
) => void

interface AggregateRawDataReturns {
  fixtures: Map<string, Map<string, Fixture[]>>,
  dates: Set<string>
  times: Set<string>
  pitches: Set<string>
  stages: Set<string>
  teams: Set<string>
  refs: Set<string>
  dateFixtureCount: Map<string, number>
}

const columnToLetter = (column: number): string => {
  let temp,
    letter = ''

  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }

  return letter
}

const normalizeDate = (date: string): string => {
  const yearIncluded = /\d{2,4}$/
  const thSearch = /(\d+)(st|nd|rd|th)/i

  if (!yearIncluded.test(date)) {
    date = date + ' ' + DateTime.now().toFormat('y')
  }

  return date.replace(thSearch, '$1')
}

const normalizeRefName = (ref: string): string => {
  return ref.toUpperCase()
}

const aggregateRawData = (aggregate: Aggregated): AggregateRawDataReturns => {
  const dates = new Set<string>()
  const times = new Set<string>()
  const pitches = new Set<string>()
  const stages = new Set<string>()
  const teams = new Set<string>()
  const refs = new Set<string>()
  const fixtures: Map<string, Map<string, Fixture[]>> = new Map()
  const dateFixtureCount: Map<string, number> = new Map()

  aggregate(dates, times, pitches, fixtures, teams, stages, refs, dateFixtureCount)

  return {
    fixtures,
    dates,
    times,
    pitches,
    teams,
    refs: new Set(Array.from(refs.values()).filter(
      (ref: string|null|undefined): boolean => ![null, '', undefined].includes(ref)
    )),
    stages,
    dateFixtureCount
  }
}

interface filterFixturesReturn {
  result: Map<string, Map<string, Fixture[]>>,
  total: number,
}

const filterFixtures = (fixturesByDateAndTime: Map<string, Map<string, Fixture[]>>, filters: Filters): filterFixturesReturn => {
  const globalSearch = (term: string[], fixture: Fixture): boolean => {
    const t = term[0].toLowerCase()

    return (
      fixture.date.toLowerCase().includes(t) ||
      fixture.time.toLowerCase().includes(t) ||
      fixture.stage.toLowerCase().includes(t) ||
      fixture.pitch.toLowerCase().includes(t) ||
      fixture.homeTeam.toLowerCase().includes(t) ||
      fixture.awayTeam.toLowerCase().includes(t) ||
      fixture.ref1.toLowerCase().includes(t) ||
      fixture.ref2.toLowerCase().includes(t) ||
      fixture.ref3.toLowerCase().includes(t)
    )
  }

  const result: Map<string, Map<string, Fixture[]>> = new Map()
  let timeMap: Map<string, Fixture[]>
  let filtered: Fixture[]
  let total: number = 0

  for (const [date, times] of  fixturesByDateAndTime.entries()) {
    timeMap = new Map()

    for (const [time, fixtures] of times.entries()) {
      filtered = fixtures.filter((fix: Fixture): boolean => {
        return (
            (filters.date.length === 0 || filters.date.includes(fix.date)) &&
            (filters.time.length === 0 || filters.time.includes(fix.time)) &&
            (filters.pitch.length === 0 || filters.pitch.includes(fix.pitch)) &&
            (filters.stage.length === 0 || filters.stage.includes(fix.stage)) &&
            (filters.team.length === 0 ||
                filters.team.includes(fix.homeTeam) ||
                filters.team.includes(fix.awayTeam)) &&
            (filters.ref.length === 0 ||
                filters.ref.includes(fix.ref1) ||
                filters.ref.includes(fix.ref2) ||
                filters.ref.includes(fix.ref3)) &&
            (filters.global.length === 0 || globalSearch(filters.global, fix))
        )
      })

      timeMap.set(time, filtered)
      total += filtered.length
    }

    result.set(date, timeMap)
  }

  return { result, total }
}

const byTapoffTimeAndPitch = aggregators.byTapoffTimeAndPitch(
  columnToLetter,
  normalizeDate,
  normalizeRefName
)
const pivotOnV = aggregators.pivotOnV(columnToLetter, normalizeDate, normalizeRefName)
const pivotOnVSeds = aggregators.pivotOnVSeds(columnToLetter, normalizeDate, normalizeRefName)

export {
  aggregateRawData,
  filterFixtures,
  byTapoffTimeAndPitch,
  pivotOnV,
  pivotOnVSeds,
  isDateValue,
  isPitchValue,
  isTimeValue
}
