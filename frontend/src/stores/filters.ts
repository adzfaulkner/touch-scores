import type { FilterState, Filters, FilterBy } from '@/types'

import type { FixtureFilters, FixturesRetrieved } from '@/types-api'

import { useStorage, StorageSerializers } from '@vueuse/core'
import { defineStore } from 'pinia'

import { sheetConfigs } from '@/sheet-config'
import { useFixtureStore } from '@/stores/fixture'

const storageUid = btoa(sheetConfigs.map((c) => c.sheetId).join('|'))

const defaultFilters: Filters = {
  date: [] as string[],
  time: [] as string[],
  stage: [] as string[],
  pitch: [] as string[],
  ref: [] as string[],
  team: [] as string[],
  global: [] as string[]
}

export const useFilterStore = defineStore('filter', {
  state: (): FilterState => {
    return {
      filteringInProgress: false,
      values: {
        teams: [],
        referees: [],
        times: [],
        pitches: [],
        stages: [],
      },
      globalValue: useStorage(`fixtures/${storageUid}/globalValue`, ''),
      filters: useStorage(
        `fixtures/${storageUid}/filters`,
        {
          ...defaultFilters
        },
        undefined,
        { serializer: StorageSerializers.object }
      )
    }
  },
  actions: {
    setValues(data: FixturesRetrieved[]): void  {
      const vals: FixtureFilters = {
        ...this.values
      }

      const ff = data.map((rf: FixturesRetrieved) => rf.fixtureFilters)

      this.values = ff.reduce((acc: FixtureFilters, v: FixtureFilters): FixtureFilters => {
        acc.referees = Array.from(new Set([...acc.referees, ...v.referees])).sort()
        acc.pitches = Array.from(new Set([...acc.pitches, ...v.pitches])).sort()
        acc.stages = Array.from(new Set([...acc.stages, ...v.stages])).sort()
        acc.teams = Array.from(new Set([...acc.teams, ...v.teams])).sort()
        acc.times = Array.from(new Set([...acc.times, ...v.times])).sort()

        return acc
      }, vals)
    },
    filterBy(filterBy: FilterBy, value: string[]): void {
      this.filters = {
        ...this.filters,
        [String(filterBy)]: value.filter((val) => val !== '')
      }

      const fixtureStore = useFixtureStore()
      fixtureStore.newFiltersApplied(this.filters)
    },
    resetFilters(): void {
      this.filters = { ...defaultFilters }
      this.globalValue = ''
    },
    setFilteringInProgress(filteringInProgress: boolean): void {
      this.filteringInProgress = filteringInProgress
    }
  },
  getters: {
    filtersApplied: (state): Filters => state.filters,
    isFilteringInProgress: (state): boolean => state.filteringInProgress
  }
})
