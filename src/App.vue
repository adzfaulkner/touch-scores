<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { RouterView } from 'vue-router'

import ActivityMonitor from '@/components/ActivityMonitor.vue'
import AuthenticationControls from '@/components/AuthenticationControls.vue'
import NotificationAlert from '@/components/NotificationAlert.vue'
import ModalBackdrop from '@/components/ModalBackdrop.vue'
import ModalView from '@/components/ModalView.vue'
import FixtureFilter from '@/components/FixtureFilter.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFixtureStore } from '@/stores/fixture'

const loadFixtures = inject('loadFixtures') as Function
const authenticationStore = useAuthenticationStore()
const fixtureStore = useFixtureStore()

const showModal: Ref<boolean> = ref(false)
const showActivityModal: Ref<boolean> = ref(false)

setInterval((): void => {
  if (authenticationStore.isAuthenticated || fixtureStore.isFilteringInProgress) {
    return
  }

  loadFixtures()
}, 15000)

const toggleModal = (): void => {
  showModal.value = !showModal.value
}

const noOfResults = (): number => {
  return fixtureStore.totalFixturesFound
}

const refreshFixtures = async (): Promise<any> => {
  showActivityModal.value = true
  await loadFixtures()
  showActivityModal.value = false
}
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="container pt-2 pb-2">
        <span class="navbar-brand logo-container">
          <img src="@/assets/logo.png" class="img-fluid" alt="TheTouch.live" />
        </span>
        <AuthenticationControls @openFilerModal="toggleModal" @refreshFixtures="refreshFixtures" />
      </div>
    </nav>
  </header>
  <main>
    <RouterView />
    <NotificationAlert />
  </main>
  <ModalView :id="'filterModal'" :open="showModal" @close="toggleModal">
    <template #header>
      Filter Fixtures&nbsp;-&nbsp;<span :class="noOfResults() > 0 ? 'text-success' : 'text-danger'"
        >{{ noOfResults() }} {{ noOfResults() === 1 ? 'result' : 'results' }} found</span
      >
    </template>
    <template #default>
      <FixtureFilter />
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="fixtureStore.resetFilters">
        <i class="bi bi-backspace-fill"></i> Reset Filters
      </button>
      <button class="btn btn-primary" @click="toggleModal">
        <i class="bi bi-eye-fill"></i> View Results
      </button>
    </template>
  </ModalView>
  <ActivityMonitor :open="showActivityModal" />
  <ModalBackdrop :open="showModal || showActivityModal" />
</template>

<style scoped>
  .logo-container {
    width: 100%;
    max-width: 180px;
  }
</style>
