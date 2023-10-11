<script async setup lang="ts">
import { RouterView } from 'vue-router'

import AppNavigation from '@/components/AppNavigation.vue'
import NavBar from '@/components/NavBar.vue'
import NotificationAlert from '@/components/NotificationAlert.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main>
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
    margin-bottom: 120px;
  }

  .notification-container {
    margin-bottom: 150px;
  }
</style>
