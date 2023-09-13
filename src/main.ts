import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { getEnv } from '@/support/env'
import { initApiClient, initSignInClient } from '@/support/google-clients'
import { useFixtureStore } from '@/stores/fixture'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

const tokenClient = await initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES'))
const apiClient = await initApiClient(getEnv('VITE_API_KEY'), [getEnv('VITE_DISCOVERY_DOC')])

app.provide('googleTokenClient', tokenClient)
app.provide('googleAPIClient', apiClient)

const fixtureStore = useFixtureStore()
const loadFixtures = fixtureStore.loadFixtures(apiClient)

app.provide('loadFixtures', loadFixtures)

app.mount('#app')
