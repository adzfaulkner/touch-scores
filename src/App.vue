<script async setup lang="ts">
import { RouterView } from 'vue-router'

import AppNavigation from '@/components/AppNavigation.vue'
import AuthenticationControls from '@/components/AuthenticationControls.vue'
import NotificationAlert from '@/components/NotificationAlert.vue'
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="container pt-2 pb-2">
        <span class="navbar-brand logo-container">
          <img src="@/assets/logo.png" class="img-fluid" alt="TheTouch.live" />
        </span>
        <AuthenticationControls />
      </div>
    </nav>
  </header>
  <main>
    <div class="router-container" style="margin-bottom: 120px;">
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
  .logo-container {
    width: 100%;
    max-width: 180px;
  }

  .router-container {
    margin-bottom: 120px;
  }

  .notification-container {
    margin-bottom: 150px;
  }
</style>
