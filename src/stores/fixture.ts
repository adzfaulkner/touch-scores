import { useStorage, StorageSerializers } from '@vueuse/core'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import type { Filters, Fixture, FilterBy } from '@/types'

import { aggregateRawData, filterFixtures, pivotOnVSeds } from '@/support/fixtures'
import { useAuthenticationStore } from '@/stores/authentication'
import { useNotificationStore } from '@/stores/notification'
import { useStandingsStore } from '@/stores/standings'
import { makeAPICall } from '@/support/google-clients'

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
      standings: [
        'Pool One Standings!B11:S13',
        'Pool Two Standings!B11:S13',
        'Cup Standings!B11:S13',
        'Plate Standings!B11:S13',
      ],
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

        const getFixtureData = async (config: any) => {
          return await makeAPICall(
              async () => {
                return await batchGetSheetValues(
                    config.sheetId,
                    [
                      config.ranges.schedule,
                      ...config.ranges.standings
                    ]
                )
              },
              async () => {
                const authenticationStore = useAuthenticationStore()
                authenticationStore.expiredToken()

                return await batchGetSheetValues(
                    config.sheetId,
                    [
                      config.ranges.schedule,
                      ...config.ranges.standings
                    ]
                )
              }
          )
        }

        const standingsStore = useStandingsStore()

        for (const config of configs) {
          const data = await getFixtureData(config)

          const readFromCell = config.ranges.schedule.match(fromCellRegex)

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
            pivotOnVSeds(data[0].values,  Number(readFromCell?.[1] ?? 0), config.competition, date)
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

          standingsStore.standings = data.slice(1)
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
    updateSheet (batchUpdateSheetValues: Function): Function {
      return async (scores: string[][]): Promise<any> => {
        const notificationStore = useNotificationStore()
        const authenticationStore = useAuthenticationStore()

        await makeAPICall(
          async () => {
            await batchUpdateSheetValues(
                configs[0].sheetId,
                scores.map((score: string[]) => ({
                  range: score[0],
                  values: [
                    [
                      score[1],
                    ],
                  ],
                }))
            )

            notificationStore.setNotification(true, 'Fixture(s) updated')
          },
          () => {
            authenticationStore.expiredToken()
            notificationStore.setNotification(false, 'Signed out due to expired token. Please sign-in again')
          },
        )
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
