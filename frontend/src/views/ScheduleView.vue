<script setup lang="ts">
import type { Ref } from 'vue'

import { inject, ref } from 'vue'
import ActionBar from '@/components/ActionBar.vue'
import ActivityMonitor from '@/components/ActivityMonitor.vue'
import FixtureFilter from '@/components/FixtureFilter.vue'
import FixtureList from '@/components/FixtureList.vue'
import ModalBackdrop from '@/components/ModalBackdrop.vue'
import ModalView from '@/components/ModalView.vue'
import { useFilterStore } from '@/stores/filters'
import { useFixtureStore } from '@/stores/fixture'

const requestFixtures = inject('requestFixtures') as Function

const filtersStore = useFilterStore()
const fixtureStore = useFixtureStore()

const showFilterModal: Ref<boolean> = ref(false)
const showPitchMapModal: Ref<boolean> = ref(false)
const showActivityModal: Ref<boolean> = ref(false)

const noOfResults = (): number => {
  return fixtureStore.totalFixturesFound
}

const toggleFilterModal = (): void => {
  showFilterModal.value = !showFilterModal.value
}

const togglePitchMapModal = (): void => {
  showPitchMapModal.value = !showPitchMapModal.value
}

const refreshFixtures = async (): Promise<void> => {
  showActivityModal.value = true
  await requestFixtures()
  showActivityModal.value = false
}
</script>

<template>
  <div class="actionbar-container sticky-top bg-white">
    <ActionBar>
      <button class="btn btn text-primary fw-bold border-0 m-0" type="button" @click="toggleFilterModal">
        <i class="bi bi-filter me-1"></i>Filter
      </button>
      <button class="btn btn text-primary fw-bold border-0 m-0" type="button" @click="togglePitchMapModal">
        <i class="bi bi-map me-1"></i>Venue Layout
      </button>
      <button
        class="btn text-primary fw-bold border-0 m-0"
        type="button"
        @click="refreshFixtures"
      >
        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
      </button>
    </ActionBar>
  </div>
  <div class="container">
    <FixtureList />
  </div>
  <ModalView :id="'pitchMapModal'" :open="showPitchMapModal" @close="togglePitchMapModal">
    <template #header></template>
    <template #default>
      <img src="@/assets/highfields.jpeg" class="img-fluid" alt="Riverside pitch map" />
      <img src="@/assets/riverside.jpeg" class="img-fluid" alt="Riverside pitch map" />
    </template>
  </ModalView>
  <ModalView :id="'filterModal'" :open="showFilterModal" @close="toggleFilterModal">
    <template #header>
      Filter Fixtures&nbsp;-&nbsp;<span :class="noOfResults() > 0 ? 'text-success' : 'text-danger'"
        >{{ noOfResults() }} {{ noOfResults() === 1 ? 'result' : 'results' }} found</span
      >
    </template>
    <template #default>
      <FixtureFilter />
    </template>
    <template #footer>
      <button class="btn btn-secondary" @click="filtersStore.resetFilters">
        <i class="bi bi-backspace-fill"></i> Reset Filters
      </button>
      <button class="btn btn-primary" @click="toggleFilterModal">
        <i class="bi bi-eye-fill"></i> View Results
      </button>
    </template>
  </ModalView>
  <ActivityMonitor :open="showActivityModal" />
  <ModalBackdrop :open="showFilterModal || showPitchMapModal || showActivityModal" />
</template>

<style scoped>
.actionbar-container {
  margin-bottom: 10px;
}
</style>
