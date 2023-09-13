<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { RouterView } from 'vue-router'

import AuthenticationControls from '@/components/AuthenticationControls.vue'
import NotificationAlert from '@/components/NotificationAlert.vue'
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
      <div class="container">
        <span class="navbar-brand">
          <img src="@/assets/eta_logo.png" alt="Logo" width="130" height="75" />
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
  <ModalView :id="'activityModal'" :open="showActivityModal" @close="() => {}">
    <template #default>
      <div class="d-flex justify-content-center align-items-center" style="height: 100%">
        <div class="spinner-border" style="width: 200px; height: 200px" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </template>
  </ModalView>
</template>

<style scoped></style>
