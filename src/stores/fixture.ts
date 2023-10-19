import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import type { Competition, FixtureState, Fixture, SheetConfig } from '@/types'

import { sheetConfigs } from '@/sheet-config'
import { aggregateRawData, filterFixtures, pivotOnVSeds } from '@/support/fixtures'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFilterStore } from '@/stores/filters'
import { useNotificationStore } from '@/stores/notification'
import { useStandingsStore } from '@/stores/standings'
import { makeAPICall } from '@/support/google-clients'

const fromCellRegex = /(\d+):/

interface FixturesByDateTimes {
  time: string
  fixtures: Fixture[]
}

export interface FixturesByDate {
  date: DateTime
  isToday: boolean
  competition: Competition
  totalCount: number
  times: FixturesByDateTimes[]
}

export interface SheetUpdate {
  sheetId: string
  value: string
  range: string
}

const getFixtureData = async (batchGetSheetValues: Function, config: SheetConfig): Promise<any> => {
  const payload = [config.ranges.slotInfo, config.ranges.schedule, ...config.ranges.standings]

  return await makeAPICall(
    async () => {
      return await batchGetSheetValues(config.sheetId, payload)
    },
    async () => {
      const authenticationStore = useAuthenticationStore()
      authenticationStore.expiredToken()

      return await batchGetSheetValues(config.sheetId, payload)
    }
  )
}

export const useFixtureStore = defineStore('fixture', {
  state: (): FixtureState => {
    return {
      initialized: false,
      fixtures: [],
      filtered: [],
      dates: [],
      competitions: [],
      pitches: [],
      refs: [],
      teams: [],
      times: [],
      stages: [],
      dateCompetitionMap: new Map()
    }
  },
  actions: {
    loadFixtures(batchGetSheetValues: Function): Function {
      return async (): Promise<void> => {
        let staged = {
          fixtures: [] as Fixture[],
          filtered: [] as Fixture[],
          dates: [] as string[],
          pitches: [] as string[],
          refs: [] as string[],
          teams: [] as string[],
          times: [] as string[],
          competitions: [] as string[],
          stages: [] as string[]
        }

        const filtersStore = useFilterStore()
        const standingsStore = useStandingsStore()

        for (const config of sheetConfigs) {
          const data = await getFixtureData(batchGetSheetValues, config)

          const competition: Competition = {
            sheetId: config.sheetId,
            name: config.competition,
            info: data[0].values[0][0]
          }

          const readFromCell = config.ranges.schedule.match(fromCellRegex)

          const date =
            config.date !== null
              ? DateTime.fromISO(config.date).toFormat('cccc d MMMM y').toUpperCase()
              : null

          const { fixtures, dates, pitches, refs, teams, times, stages, competitions } =
            aggregateRawData(
              pivotOnVSeds(data[1].values, Number(readFromCell?.[1] ?? 0), competition, date)
            )

          staged = {
            ...staged,
            fixtures: [...staged.fixtures, ...fixtures],
            dates: [...new Set([...staged.dates, ...dates])],
            pitches: [...new Set([...staged.pitches, ...pitches])],
            refs: [...new Set([...staged.refs, ...refs])],
            teams: [...new Set([...staged.teams, ...teams])],
            times: [...new Set([...staged.times, ...times])],
            competitions: [...new Set([...staged.competitions, ...competitions])],
            stages: [...new Set([...staged.stages, ...stages])]
          }

          staged.filtered = [...staged.filtered, ...filterFixtures(fixtures, filtersStore.filters)]

          for (const date of dates) {
            this.dateCompetitionMap.set(date, competition)
          }

          standingsStore.standings = data.slice(2)
        }

        this.fixtures = staged.fixtures
        this.filtered = staged.filtered
        this.dates = staged.dates
        this.pitches = staged.pitches
        this.refs = staged.refs
        this.teams = staged.teams
        this.times = staged.times
        this.competitions = staged.competitions
        this.stages = staged.stages
        this.initialized = true
      }
    },
    updateSheet(batchUpdateSheetValues: Function): Function {
      return async (updates: SheetUpdate[]): Promise<void> => {
        const groupedBySheet: Map<string, SheetUpdate[]> = new Map()
        for (const l of updates) {
          if (!groupedBySheet.has(l.sheetId)) {
            groupedBySheet.set(l.sheetId, [])
          }

          groupedBySheet.get(l.sheetId)?.push(l)
        }

        groupedBySheet.forEach((updates: SheetUpdate[], sheetId: string) => {
          makeAPICall(
            async () => {
              await batchUpdateSheetValues(
                sheetId,
                updates.map((update: SheetUpdate) => ({
                  range: update.range,
                  values: [[update.value]]
                }))
              )
            },
            () => {
              const authenticationStore = useAuthenticationStore()
              const notificationStore = useNotificationStore()

              authenticationStore.expiredToken()
              notificationStore.setNotification(
                false,
                'Signed out due to expired token. Please sign-in again'
              )
            }
          )
        })
      }
    }
  },
  getters: {
    fixturesByDate: (state): FixturesByDate[] => {
      const dateTimeIndexes = new Map()
      const nowStr = DateTime.now().toFormat('d MMMM y')

      const primed = state.dates.map((dateStr: string): FixturesByDate => {
        const date = DateTime.fromFormat(dateStr, 'EEEE d MMMM y')
        const competition = state.dateCompetitionMap.get(dateStr) as Competition

        return {
          date,
          isToday: date.toFormat('d MMMM y') === nowStr,
          competition,
          totalCount: 0,
          times: []
        }
      })

      return state.filtered
        .reduce((grouped: FixturesByDate[], fixture: Fixture): FixturesByDate[] => {
          const { date, time } = fixture

          const dateIndex = state.dates.indexOf(date)
          let dateTimeIndex = dateTimeIndexes.get(`${date}|${time}`)

          if (dateTimeIndex === undefined) {
            grouped[dateIndex].times.push({
              time,
              fixtures: []
            })

            dateTimeIndex = grouped[dateIndex].times.length - 1
            dateTimeIndexes.set(`${date}|${time}`, dateTimeIndex)
          }

          grouped[dateIndex].times[dateTimeIndex].fixtures.push(fixture)
          grouped[dateIndex].totalCount++

          return grouped
        }, primed)
        .sort(
          (a: FixturesByDate, b: FixturesByDate) =>
            parseInt(a.date.toFormat('yMMdd'), 10) - parseInt(b.date.toFormat('yMMdd'), 10)
        )
    },
    totalFixturesFound: (state): number => state.filtered.length
  }
})
