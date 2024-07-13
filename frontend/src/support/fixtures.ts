import type { Filters, Fixture } from '@/types'

const dateRegex = /^MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY/i
const timeRegex = /^\d+:\d+$/
const pitchRegex = /^Field|Pitch|AGP|FOD|Roadside|Farside/i

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

const filterFixtures = (fixtures: Fixture[], filters: Filters): Fixture[] => {
  const globalSearch = (term: string[], fixture: Fixture): boolean => {
    const t = term[0].toLowerCase()

    return (
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
        (filters.global.length === 0 || globalSearch(filters.global, fix)) &&
        (!('stream' in filters) || filters.stream.length === 0 || filters.stream[0] === 'false' || fix.videoUrl !== '')
    )
  })
}

export {
  filterFixtures,
  isDateValue,
  isPitchValue,
  isTimeValue
}
