import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import type {
  FixtureState,
  Filters, FixturesBySheetDate, SheetConfig
} from '@/types'

import type {
  FixtureByTime,
  FixturesRetrieved, ScheduleByDate
} from '@/types-api'

import { sheetConfigMap } from '@/sheet-config'
import { useFilterStore } from '@/stores/filters'
import { filterFixtures } from '@/support/fixtures'

export const useFixtureStore = defineStore('fixture', {
  state: (): FixtureState => {
    return {
      initialized: false,
      sheetIdFixturesRetrievedMap: new Map(),
      fixturesRetrieved: [],
      fixturesRetrievedFiltered: [],
    }
  },
  actions: {
    intFixtures(data: FixturesRetrieved[]) {
      const sheetIdFixturesRetrievedMap = new Map()
      data.map(({sheetId}, i) => sheetIdFixturesRetrievedMap.set(sheetId, i), data)

      const filterStore = useFilterStore()

      this.sheetIdFixturesRetrievedMap = sheetIdFixturesRetrievedMap
      this.fixturesRetrieved = data
      this.newFiltersApplied(filterStore.filtersApplied)
      this.initialized = true
    },
    newFiltersApplied(filters: Filters): void {
      this.fixturesRetrievedFiltered = this.fixturesRetrieved.map((fr: FixturesRetrieved): FixturesRetrieved => {
        return {
          ...fr,
          schedulesByDate: fr.schedulesByDate.map((sbd: ScheduleByDate): ScheduleByDate => {
            return {
              ...sbd,
              fixturesByTime: sbd.fixturesByTime.map((fbd: FixtureByTime): FixtureByTime | null => {
                const fixtures = filterFixtures(fbd.fixtures, filters)

                if (fixtures.length === 0) {
                  return null
                }

                return {
                  ...fbd,
                  fixtures,
                } as FixtureByTime
              }).filter((v: FixtureByTime | null): boolean => v !== null)
            } as ScheduleByDate
          })
        } as FixturesRetrieved
      })
    }
  },
  getters: {
    fixturesBySheetDates: (state): FixturesBySheetDate[] => {
      const nowStr = DateTime.now().toFormat('d MMMM y')
      const result: FixturesBySheetDate[] = []
      let primed: FixturesBySheetDate

      for (const { sheetId, schedulesByDate } of state.fixturesRetrievedFiltered) {
        for (const { date, slotInfo, playOffSlotInfo, fixturesByTime } of schedulesByDate) {
          const { competition } = sheetConfigMap.get(sheetId) as SheetConfig
          const dateO = DateTime.fromISO(date)

          primed = {
            comp: competition,
            sheetId,
            date: dateO,
            isToday: dateO.toFormat('d MMMM y') === nowStr,
            totalCount: calculateSchedulesByDateTotalFixtures(fixturesByTime),
            fixturesByTime,
            slotInfo,
            playOffSlotInfo,
          }

          result.push(primed)
        }
      }

      return result
    },
    totalFixturesFound: (state): number => {
      return state.fixturesRetrievedFiltered.reduce(
          (accumulator: number, { schedulesByDate }): number => {
            for (const { fixturesByTime } of schedulesByDate) {
              accumulator += calculateSchedulesByDateTotalFixtures(fixturesByTime)
            }

            return accumulator
          }, 0
      ) as number
    }
  }
})

function calculateSchedulesByDateTotalFixtures(fixturesByTime: FixtureByTime[]): number {
  return fixturesByTime.reduce(
      (accumulator: number, { fixtures }): number => {
        return accumulator + fixtures.length
      }, 0
  ) as number
}
