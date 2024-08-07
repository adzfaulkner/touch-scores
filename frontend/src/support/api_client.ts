import axios from 'axios';

import type { SheetConfig, SheetUpdate } from '@/types'

import { sheetConfigs, sheetConfigMap } from '@/sheet-config'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFilterStore } from '@/stores/filters'
import { useFixtureStore } from '@/stores/fixture'
import { useStandingsStore } from '@/stores/standings'
import { getWS } from '@/support/websocket'
import { getEnv } from '@/support/env'

const initWs = () => {
    const authenticationStore = useAuthenticationStore()
    const filtersStore = useFilterStore()
    const fixtureStore = useFixtureStore()
    const standingsStore = useStandingsStore()

    const ws = (): WebSocket => getWS(
        getEnv('VITE_API_WS_URL'),
        () => {
            requestFixtures()
        },
        (e: MessageEvent) => {
            const { event, data: { data: { schedules, fixtureFilters } }  } = JSON.parse(e.data)

            switch (event) {
                case 'UPDATE_RECEIVED':
                    if (!authenticationStore.isAuthenticated && !filtersStore.isFilteringInProgress && sheetConfigMap.has(schedules[0].spreadsheetId)) {
                        ws().send(JSON.stringify({
                            action: 'GET_FIXTURES',
                            configs: [sheetConfigMap.get(schedules[0].spreadsheetId)],
                        }))
                    }
                    break;
                case 'FIXTURES_RETRIEVED':
                    fixtureStore.intFixtures(schedules)
                    filtersStore.setValues(fixtureFilters)
                    standingsStore.setValues(schedules)
                    break
            }
        }
    )

    ws()

    const requestFixtures = ((ws: Function, sheetConfigs: SheetConfig[]) => () => {
        ws().send(JSON.stringify({
            action: 'GET_FIXTURES',
            configs: sheetConfigs,
        }))
    })(ws, sheetConfigs)

    const updateSheet = (updates: SheetUpdate[]) => ws().send(JSON.stringify({
        action: 'UPDATE_FIXTURES',
        updates,
    }))
    
    return {
        requestFixtures,
        updateSheet,
    }
}

const initPolling = () => {
    const authenticationStore = useAuthenticationStore()
    const filtersStore = useFilterStore()
    const fixtureStore = useFixtureStore()
    const standingsStore = useStandingsStore()

    const requestFixtures = async () => {
        const { data: { data: { schedules, fixtureFilters } } } = await axios.get(getEnv('VITE_API_URL') + '/get', {
            params: {
                q: btoa(JSON.stringify({
                    action: 'GET_FIXTURES',
                    configs: sheetConfigs,
                })),
            }
        })

        fixtureStore.intFixtures(schedules)
        filtersStore.setValues(fixtureFilters)
        standingsStore.setValues(schedules)
    }

    requestFixtures()
    setInterval(() => {
        if (!authenticationStore.isAuthenticated && !filtersStore.isFilteringInProgress) {
            requestFixtures()
        }
    }, 200000)

    return {
        requestFixtures,
        updateSheet: () => {},
    }
}

const initApiClient = () => getEnv('VITE_USE_WEBSOCKET') !== 'false' ? initWs() : initPolling()

export {
    initApiClient
}
