import type { FilterState, Filters, FilterBy } from '@/types'

import type { FixtureFilters } from '@/types-api'

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
  global: [] as string[],
  stream: [] as string[],
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
    setValues(fixtureFilters: FixtureFilters): void  {
      this.values = {
        ...fixtureFilters
      }
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
