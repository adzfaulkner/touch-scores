<script setup lang="ts">
import { RouterView } from 'vue-router'

import ActivityMonitor from '@/components/ActivityMonitor.vue'
import AppNavigation from '@/components/AppNavigation.vue'
import NavBar from '@/components/NavBar.vue'
import NotificationAlert from '@/components/NotificationAlert.vue'
import { useFixtureStore } from '@/stores/fixture'

const fixtureStore = useFixtureStore()
</script>

<template>
  <header>
    <NavBar :show-authentication-controls="fixtureStore.initialized" />
  </header>
  <main>
    <div class="router-container">
      <ActivityMonitor :open="!fixtureStore.initialized" />
      <RouterView v-if="fixtureStore.initialized" />
    </div>
    <div class="notification-container fixed-bottom bottom-0 start-50">
      <NotificationAlert />
    </div>
    <div class="fixed-bottom" v-if="fixtureStore.initialized">
      <AppNavigation />
    </div>
  </main>
</template>

<style scoped>
.router-container {
  margin-bottom: 80px;
}

.notification-container {
  margin-bottom: 110px;
}
</style>
