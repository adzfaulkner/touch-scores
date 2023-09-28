import { useStorage, StorageSerializers } from '@vueuse/core'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import { aggregateRawData, filterFixtures, pivotOnVSeds } from '@/support/fixtures'
import { useNotificationStore } from '@/stores/notification'
import type { Filters, Fixture, FilterBy } from '@/types'
import { useAuthenticationStore } from '@/stores/authentication'

const fromCellRegex = /(\d+):/

export interface State {
  filteringInProgress: boolean
  fixtures: Fixture[]
  filtered: Fixture[]
  globalValue: string
  filters: Filters
  dates: string[]
  times: string[]
  pitches: string[]
  competitions: string[]
  stages: string[]
  teams: string[]
  refs: string[]
  dateCompetitionMap: Map<string, string>
}

export interface FixturesByDateTimes {
  time: string
  fixtures: Fixture[]
}

export interface FixturesByDate {
  date: DateTime
  competition: string
  totalCount: number
  times: FixturesByDateTimes[]
}

const defaultFilters: Filters = {
  date: [] as string[],
  time: [] as string[],
  stage: [] as string[],
  pitch: [] as string[],
  ref: [] as string[],
  team: [] as string[],
  global: [] as string[]
}

const configs = [
  {
    sheetId: '1sBY-UbKEU30TD4WZJE_-HLjYr6g0WcIoI7miGEITyMc',
    date: '2023-10-07T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A10:P',
      refAllocations: null
    },
    competition: 'seds'
  }
]

const storageUid = btoa(configs.map((c) => c.sheetId).join('|'))

export const useFixtureStore = defineStore('fixture', {
  state: (): State => {
    return {
      filteringInProgress: false,
      fixtures: [],
      filtered: [],
      globalValue: useStorage(`fixtures/${storageUid}/globalValue`, '') as any,
      filters: useStorage(
        `fixtures/${storageUid}/filters`,
        {
          ...defaultFilters
        },
        undefined,
        { serializer: StorageSerializers.object }
      ) as any,
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
    loadFixtures(apiClient: any): Function {
      return async (detectChange: Boolean = false): Promise<any> => {
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

        for (const config of configs) {
          const {
            result: { values: s }
          } = await apiClient.sheets.spreadsheets.values.get({
            spreadsheetId: config.sheetId,
            range: config.ranges.schedule
          })

          const m = config.ranges.schedule.match(fromCellRegex)

          const date =
            config.date !== null
              ? DateTime.fromISO(config.date).toFormat('cccc d MMMM y').toUpperCase()
              : null

          const {
            fixtures,
            dates,
            pitches,
            refs,
            teams,
            times,
            stages,
            competitions
            // @ts-ignore
          } = aggregateRawData(
            pivotOnVSeds(s,  Number(m?.[1] ?? 0), config.competition, date)
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

          staged.filtered = [...staged.filtered, ...filterFixtures(fixtures, this.filters)]

          for (const date of dates) {
            this.dateCompetitionMap.set(date, config.competition)
          }
        }

        if (detectChange && JSON.stringify(this.fixtures) !== JSON.stringify(staged.fixtures)) {
          const notificationStore = useNotificationStore()
          notificationStore.setNotification(true, 'Fixtures auto updated', false)
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
      }
    },
    filterBy(filterBy: FilterBy, value: string[]): void {
      this.filters = {
        ...this.filters,
        [String(filterBy)]: value.filter((val) => val !== '')
      }

      this.filtered = filterFixtures(this.fixtures, this.filters).map((fixture: Fixture) => {
        return { ...fixture }
      })
    },
    resetFilters(): void {
      this.filters = { ...defaultFilters }
      this.globalValue = ''
      this.filtered = filterFixtures(this.fixtures, this.filters)
    },
    setFilteringInProgress(filteringInProgress: boolean): void {
      this.filteringInProgress = filteringInProgress
    },
    updateSheet(apiClient: any): Function {
      return (scores: string[][]): void => {
        const notificationStore = useNotificationStore()
        const authenticationStore = useAuthenticationStore()

        apiClient.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: configs[0].sheetId,
          resource: {
            data: scores.map((score: string[]) => ({
              range: score[0],
              values: [
                [
                  score[1],
                ],
              ],
            })),
            valueInputOption: 'RAW',
          },
        }).then(() => {
          notificationStore.setNotification(true, 'Fixture(s) updated')
        }).catch(e => {
          if (e.status === 401) {
            authenticationStore.token = null
            notificationStore.setNotification(false, 'Logged out expired token')
          }
        })
      }
    },
  },
  getters: {
    fixturesByDate: (state): FixturesByDate[] => {
      const dateTimeIndexes = new Map()

      const primed = state.dates.map((date: string): FixturesByDate => {
        return {
          date: DateTime.fromFormat(date, 'EEEE d MMMM y'),
          competition: state.dateCompetitionMap.get(date) as string,
          totalCount: 0,
          times: []
        }
      })

      return state.filtered.reduce(
        (grouped: FixturesByDate[], fixture: Fixture): FixturesByDate[] => {
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
        },
        primed
      )
    },
    filtersApplied: (state): Filters => state.filters,
    totalFixturesFound: (state): number => state.filtered.length,
    isFilteringInProgress: (state): boolean => state.filteringInProgress
  }
})
