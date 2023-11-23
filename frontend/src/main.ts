import { createApp } from 'vue'
import { createPinia } from 'pinia'

import type {SheetConfig} from '@/types'

import App from './App.vue'
import router from './router'
import { sheetConfigs, sheetConfigMap } from '@/sheet-config'
import { getEnv } from '@/support/env'
import {
  initApiClient,
  initSignInClient,
  batchUpdateSheetValues
} from '@/support/google-clients'
import { getWS } from "@/support/websocket";
import { useAuthenticationStore } from '@/stores/authentication'
import { useFixtureStore } from '@/stores/fixture'
import { useFilterStore } from '@/stores/filters'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

const authenticationStore = useAuthenticationStore()
const filtersStore = useFilterStore()
const fixtureStore = useFixtureStore()

const ws = (): WebSocket => getWS(
  'wss://9yyvd90hs1.execute-api.eu-west-2.amazonaws.com/dev',
  (e: Event) => {
    console.log('Socket opened')
    requestFixtures()
   },
  (e: MessageEvent) => {
    const { event, data } = JSON.parse(e.data)

    switch (event) {
      case 'UPDATE_RECEIVED':
        if (!authenticationStore.isAuthenticated && !filtersStore.isFilteringInProgress && sheetConfigMap.has(data.spreadsheetId)) {
          ws().send(JSON.stringify([sheetConfigMap.get(data.spreadsheetId)]))
        }
        break;
      case 'FIXTURES_RETRIEVED':
        fixtureStore.setFixtures(data)
        break;
    }
  }
)

ws()

const requestFixtures = ((ws: Function, sheetConfigs: SheetConfig[]) => () => {
  ws().send(JSON.stringify(sheetConfigs))
})(ws, sheetConfigs)

app.provide('requestFixtures', requestFixtures)

initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES'))
initApiClient(getEnv('VITE_API_KEY'), [getEnv('VITE_DISCOVERY_DOC')], authenticationStore.token)

const updateSheet = fixtureStore.updateSheet(batchUpdateSheetValues)
app.provide('updateSheet', updateSheet)

app.mount('#app')
