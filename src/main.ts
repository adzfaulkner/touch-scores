import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { getEnv } from '@/support/env'
import { initApiClient, initSignInClient } from '@/support/google-clients'
import { useFixtureStore } from '@/stores/fixture'
import { useAuthenticationStore } from '@/stores/authentication'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

const fixtureStore = useFixtureStore()
const authenticationStore = useAuthenticationStore()

const tokenClient = await initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES'))
const apiClient = await initApiClient(getEnv('VITE_API_KEY'), [getEnv('VITE_DISCOVERY_DOC')])

apiClient.setToken(authenticationStore.token)

app.provide('googleTokenClient', tokenClient)
app.provide('googleAPIClient', apiClient)

const loadFixtures = fixtureStore.loadFixtures(apiClient)
const updateSheet = fixtureStore.updateSheet(apiClient)

app.provide('loadFixtures', loadFixtures)
app.provide('updateSheet', updateSheet)

app.mount('#app')
