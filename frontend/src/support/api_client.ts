import axios from 'axios';

import type { SheetConfig, SheetUpdate } from '@/types'

import { sheetConfigs, sheetConfigMap } from '@/sheet-config'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFilterStore } from '@/stores/filters'
import { useFixtureStore } from '@/stores/fixture'
import { useStandingsStore } from '@/stores/standings'
import { getWS, sendWS } from '@/support/websocket'
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
            const r = JSON.parse(e.data)

            switch (r.event) {
                case 'UPDATE_RECEIVED':
                    if (
                        !authenticationStore.isAuthenticated
                        && !filtersStore.isFilteringInProgress
                        && sheetConfigMap.has(r.data.spreadsheetId)
                    ) {
                        sendWS(ws(), JSON.stringify({
                            action: 'GET_FIXTURES',
                            configs: [sheetConfigMap.get(r.data.spreadsheetId)],
                        }))
                    }
                    break
                case 'FIXTURES_RETRIEVED':
                    fixtureStore.intFixtures(r.data.schedules)
                    filtersStore.setValues(r.data.fixtureFilters)
                    standingsStore.setValues(r.data.schedules)
                    break
                case 'FIXTURES_UPDATED':
                    if (!r.success && r.message === 'Unauthenticated') {
                        authenticationStore.expiredToken()
                    }
                    break
            }
        }
    )

    ws()

    const requestFixtures = ((ws: Function, sednWS: Function, sheetConfigs: SheetConfig[]) => () => {
        sendWS(ws(), JSON.stringify({
            action: 'GET_FIXTURES',
            configs: sheetConfigs,
        }))
    })(ws, sendWS, sheetConfigs)

    const updateSheet = ((ws: Function, sendWS: Function) => (updates: SheetUpdate[], token: string) => sendWS(ws(), JSON.stringify({
        action: 'UPDATE_FIXTURES',
        token,
        updates,
    })))(ws, sendWS)
    
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
