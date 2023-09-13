<script setup lang="ts">
import { inject } from 'vue'

import { useAuthenticationStore } from '@/stores/authentication'

const authenticationStore = useAuthenticationStore()

const tokenClient = inject('googleTokenClient')

const emit = defineEmits(['openFilerModal', 'refreshFixtures'])
</script>

<template>
  <div id="controls">
    <div v-if="!authenticationStore.isAuthenticated">
      <button
        class="btn btn-primary"
        type="button"
        @click="authenticationStore.signIn(tokenClient)"
      >
        <i class="bi bi-box-arrow-in-right me-1"></i>Sign in
      </button>
    </div>
    <div v-else-if="authenticationStore.isAuthenticated">
      <button class="btn btn-secondary" type="button" @click="authenticationStore.signOut()">
        <i class="bi bi-box-arrow-in-left me-1"></i>Sign out
      </button>
    </div>
  </div>
  <div class="fixed-bottom">
    <div class="d-flex justify-content-around bg-primary">
      <button class="btn btn-lg btn-primary me-1" type="button" @click="emit('openFilerModal')">
        <i class="bi bi-filter me-1"></i>Filter
      </button>
      <button class="btn btn-lg btn-primary" type="button" @click="emit('refreshFixtures')">
        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
      </button>
    </div>
  </div>
</template>
