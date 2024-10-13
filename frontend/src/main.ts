import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { AwsRum } from 'aws-rum-web'

import type { AwsRumConfig } from 'aws-rum-web'

import App from './App.vue'
import router from './router'
import { initApiClient } from '@/support/api_client'
import { getEnv } from '@/support/env'
import { initSignInClient } from '@/support/google-clients'

try {
    const config: AwsRumConfig = {
        sessionSampleRate: 1,
        guestRoleArn: "arn:aws:iam::543174106112:role/RUM-Monitor-eu-west-2-543174106112-5896880981071-Unauth",
        identityPoolId: "eu-west-2:93c11437-1077-486f-838c-1fb24cebed91",
        endpoint: "https://dataplane.rum.eu-west-2.amazonaws.com",
        telemetries: ["performance","errors","http"],
        allowCookies: false,
        enableXRay: false
    }

    const APPLICATION_ID: string = '4d3d9fff-1af0-49d0-966f-ec8fd3e92c12'
    const APPLICATION_VERSION: string = '1.0.0'
    const APPLICATION_REGION: string = 'eu-west-2'

    new AwsRum(
        APPLICATION_ID,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config
    )
} catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
}

initSignInClient(getEnv('VITE_CLIENT_ID'), getEnv('VITE_SCOPES'))

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

const { requestFixtures, updateSheet } = initApiClient()

app.provide('requestFixtures', requestFixtures)
app.provide('updateSheet', updateSheet)

app.mount('#app')
