import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { getEnv } from '@/support/env'
import {
    initApiClient,
    initSignInClient,
    batchUpdateSheetValues,
    batchGetSheetValues,
} from '@/support/google-clients'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFixtureStore } from '@/stores/fixture'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

const authenticationStore = useAuthenticationStore()
const fixtureStore = useFixtureStore()

const tokenClient = await initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES'))
const apiClient = await initApiClient(getEnv('VITE_API_KEY'), [getEnv('VITE_DISCOVERY_DOC')])

apiClient.setToken(authenticationStore.token)

app.provide('googleTokenClient', tokenClient)

const loadFixtures = fixtureStore.loadFixtures(batchGetSheetValues(apiClient))
const updateSheet = fixtureStore.updateSheet(batchUpdateSheetValues(apiClient))

await loadFixtures()

setInterval((): void => {
    console.log(authenticationStore.isAuthenticated || fixtureStore.isFilteringInProgress)

    if (authenticationStore.isAuthenticated || fixtureStore.isFilteringInProgress) {
        return
    }

    loadFixtures()
}, 15000)

app.provide('loadFixtures', loadFixtures)
app.provide('updateSheet', updateSheet)

app.mount('#app')
