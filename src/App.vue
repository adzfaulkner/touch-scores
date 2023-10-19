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
  <ActivityMonitor :open="fixtureStore.fixturesByDate.length === 0" />
  <header v-if="fixtureStore.fixturesByDate.length > 0">
    <NavBar />
  </header>
  <main v-if="fixtureStore.fixturesByDate.length > 0">
    <div class="router-container">
      <RouterView />
    </div>
    <div class="notification-container fixed-bottom bottom-0 start-50">
      <NotificationAlert />
    </div>
    <div class="fixed-bottom">
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
