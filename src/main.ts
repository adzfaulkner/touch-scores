import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { getEnv } from '@/support/env'
import {
  initApiClient,
  initSignInClient,
  batchUpdateSheetValues,
  batchGetSheetValues
} from '@/support/google-clients'
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

initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES')).then((tokenClient) => {
  initApiClient(getEnv('VITE_API_KEY'), [getEnv('VITE_DISCOVERY_DOC')]).then((apiClient) => {
    apiClient.setToken(authenticationStore.token)

    app.provide('googleTokenClient', tokenClient)

    const loadFixtures = fixtureStore.loadFixtures(batchGetSheetValues(apiClient))
    const updateSheet = fixtureStore.updateSheet(batchUpdateSheetValues(apiClient))

    app.provide('loadFixtures', loadFixtures)
    app.provide('updateSheet', updateSheet)

    loadFixtures().then(() => {
      setInterval((): void => {
        if (authenticationStore.isAuthenticated || filtersStore.isFilteringInProgress) {
          return
        }

        loadFixtures()
      }, 15000)
    })
  })
})

app.mount('#app')
