import type { FilterState, Filters, FilterBy, Fixture } from '@/types'

import { useStorage, StorageSerializers } from '@vueuse/core'
import { defineStore } from 'pinia'

import { sheetConfigs } from '@/sheet-config'
import { useFixtureStore } from '@/stores/fixture'
import { filterFixtures } from '@/support/fixtures'

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
            globalValue: useStorage(`fixtures/${storageUid}/globalValue`, ''),
            filters: useStorage(
                `fixtures/${storageUid}/filters`,
                {
                    ...defaultFilters
                },
                undefined,
                { serializer: StorageSerializers.object }
            ),
        }
    },
    actions: {
        filterBy(filterBy: FilterBy, value: string[]): void {
            this.filters = {
                ...this.filters,
                [String(filterBy)]: value.filter((val) => val !== '')
            }

            const fixtureStore = useFixtureStore()

            fixtureStore.filtered = filterFixtures(fixtureStore.fixtures, this.filters).map((fixture: Fixture) => {
                return { ...fixture }
            })
        },
        resetFilters(): void {
            this.filters = { ...defaultFilters }
            this.globalValue = ''
        },
        setFilteringInProgress(filteringInProgress: boolean): void {
            this.filteringInProgress = filteringInProgress
        },
    },
    getters: {
        filtersApplied: (state): Filters => state.filters,
        isFilteringInProgress: (state): boolean => state.filteringInProgress,
    },
})