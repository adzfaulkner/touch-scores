import type { Filters, Fixture } from '@/types'

import { DateTime } from 'luxon'
import * as aggregators from '@/support/fixture'

export const dateRegex = /^MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY/i
export const timeRegex = /^\d+:\d+$/
export const pitchRegex = /^Field|Pitch /i

export type Aggregated = (
  dates: Set<string>,
  times: Set<string>,
  pitches: Set<string>,
  fixtures: Fixture[],
  teams: Set<string>,
  stages: Set<string>,
  refs: Set<string>,
  competitions: Set<string>
) => void

interface AggregateRawDataReturns {
  fixtures: Fixture[]
  dates: string[]
  times: string[]
  pitches: string[]
  competitions: string[]
  stages: string[]
  teams: string[]
  refs: string[]
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
  const fixtures: Fixture[] = []
  const competitions = new Set<string>()

  aggregate(dates, times, pitches, fixtures, teams, stages, refs, competitions)

  return {
    fixtures,
    dates: Array.from(dates.values()),
    times: Array.from(times.values()),
    pitches: Array.from(pitches.values()),
    competitions: Array.from(competitions.values()),
    teams: Array.from(teams.values()),
    refs: Array.from(refs.values()).filter(
      (ref: string): boolean => ![null, '', undefined].includes(ref)
    ),
    stages: Array.from(stages.values())
  }
}

const filterFixtures = (fixtures: Fixture[], filters: Filters): Fixture[] => {
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

  return fixtures.filter((fix: Fixture): boolean => {
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
}

const byTapoffTimeAndPitch = aggregators.byTapoffTimeAndPitch(
  columnToLetter,
  normalizeDate,
  normalizeRefName
)
const pivotOnV = aggregators.pivotOnV(columnToLetter, normalizeDate, normalizeRefName)

export { aggregateRawData, filterFixtures, byTapoffTimeAndPitch, pivotOnV }
