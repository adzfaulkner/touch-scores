import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import type {
  Competition,
  FixtureState,
  FixtureParamsBySpreadsheet,
  FixturesByCompetitionDate,
  Filters
} from '@/types'

import { sheetConfigMap } from '@/sheet-config'
import { aggregateRawData, filterFixtures, pivotOnVSeds } from '@/support/fixtures'
import { useFilterStore } from '@/stores/filters'
import { useStandingsStore } from '@/stores/standings'

const fromCellRegex = /(\d+):/

export const useFixtureStore = defineStore('fixture', {
  state: (): FixtureState => {
    return {
      initialized: false,
      events: new Map(),
      competitions: new Set(),
      totalFixtures: new Map(),
      dates: new Set(),
      times: new Set(),
      pitches: new Set(),
      refs: new Set(),
      teams: new Set(),
      stages: new Set(),
      competition: new Set(),
    }
  },
  actions: {
    setFixtures(data: any[]) {
      const filtersStore = useFilterStore()
      const standingsStore = useStandingsStore()

      const events = new Map(this.events)
      const comps: Set<string> = new Set(this.competitions)
      const totalFixtures: Map<string, number> = new Map(this.totalFixtures)
      let ds: Set<string> = new Set(this.dates)
      let ps: Set<string> = new Set(this.pitches)
      let rs: Set<string> = new Set(this.refs)
      let ss: Set<string> = new Set(this.stages)
      let ts: Set<string> = new Set(this.teams)
      let tis: Set<string> = new Set(this.times)
      let staged: FixtureParamsBySpreadsheet

      for (const comp of data) {
        const config = sheetConfigMap.get(comp.sheetId)
        const readFromCell = config.ranges.schedule.match(fromCellRegex)

        const competition: Competition = {
          sheetId: config.sheetId,
          name: config.competition,
          info: comp.ranges.slotInfo.values[0][0],
          playoffInfo: comp.ranges.playOffSlotInfo.values !== null ? comp.ranges.playOffSlotInfo.values[0][0] : null,
        }

        const date =
            config.date !== null
                ? DateTime.fromISO(config.date).toFormat('cccc d MMMM y').toUpperCase()
                : null

        const { fixtures, dates, pitches, refs, teams, times, stages } =
            aggregateRawData(
                pivotOnVSeds(comp.ranges.schedule.values, Number(readFromCell?.[1] ?? 0), date)
            )
        
        const { result, total } = filterFixtures(fixtures, filtersStore.filters)

        totalFixtures.set(comp.sheetId, total)

        staged = {
          competition: competition,
          filtered: result,
          fixtures: fixtures,
        }

        ds = new Set([...ds, ...dates])
        ps = new Set([...ps, ...pitches])
        rs = new Set([...rs, ...refs])
        ss = new Set([...ss, ...stages])
        ts = new Set([...ts, ...teams])
        tis = new Set([...tis, ...times])

        events.set(comp.sheetId, staged)
        comps.add(competition.name)

        standingsStore.standings = comp.ranges.standings
      }

      this.events = events
      this.competitions = comps
      this.totalFixtures = totalFixtures
      this.dates = ds
      this.pitches = ps
      this.refs = rs
      this.stages = ss
      this.teams = ts
      this.times = tis
      this.initialized = true
    },
    newFiltersApplied(filters: Filters): void {
      for (const [sid, params] of this.events) {
        const { result, total } = filterFixtures(params.fixtures, filters)
        this.totalFixtures.set(sid, total)

        this.events.set(sid, {
          ...params,
          filtered: result,
        })
      }
    }
  },
  getters: {
    fixturesByCompetitionDate: (state): FixturesByCompetitionDate[] => {
      const nowStr = DateTime.now().toFormat('d MMMM y')
      const result: FixturesByCompetitionDate[] = []
      let primed: FixturesByCompetitionDate

      for (const [, { competition, filtered }] of state.events) {
        for (const [dateStr, times] of filtered) {
          const date = DateTime.fromFormat(dateStr, 'EEEE d MMMM y')
          const timesFiltered = Array.from(times.entries())
              .filter(([, fixtures]) => fixtures.length > 0)

          primed = {
            date,
            isToday: date.toFormat('d MMMM y') === nowStr,
            competition,
            totalCount: timesFiltered.reduce((accum, [, fixtures]) => accum + fixtures.length, 0) as number,
            times: new Map(timesFiltered),
          }

          result.push(primed)
        }
      }

      return result
    },
    totalFixturesFound: (state): number => Array.from(state.totalFixtures.values())
        .reduce(
          (accumulator: number, totalFixtures: number): number => accumulator + totalFixtures,
          0
        ) as number
  }
})
