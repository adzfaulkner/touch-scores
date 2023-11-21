<script setup lang="ts">
import { useAuthenticationStore } from '@/stores/authentication'

const authenticationStore = useAuthenticationStore()
</script>

<template>
  <div id="controls">
    <div v-if="!authenticationStore.isAuthenticated">
      <button
        class="btn btn-primary"
        type="button"
        @click="authenticationStore.signIn()"
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
</template>
