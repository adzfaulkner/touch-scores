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

  const loadFixtures = inject('loadFixtures') as Function

  const filtersStore = useFilterStore()
  const fixtureStore = useFixtureStore()

  const showModal: Ref<boolean> = ref(false)
  const showActivityModal: Ref<boolean> = ref(false)

  const noOfResults = (): number => {
    return fixtureStore.totalFixturesFound
  }

  const toggleModal = (): void => {
    showModal.value = !showModal.value
  }

  const refreshFixtures = async (): Promise<void> => {
    showActivityModal.value = true
    await loadFixtures()
    showActivityModal.value = false
  }
</script>

<template>
  <div class="actionbar-container sticky-top bg-white">
    <ActionBar>
      <button class="btn btn-lg text-primary fw-bold border-0" type="button" @click="toggleModal">
        <i class="bi bi-filter me-1"></i>Filter
      </button>
      <button class="btn btn-lg text-primary fw-bold border-0" type="button" @click="refreshFixtures">
        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
      </button>
    </ActionBar>
  </div>
  <Suspense>
    <div class="container">
      <FixtureList />
    </div>
  </Suspense>
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
      <button class="btn btn-secondary" @click="filtersStore.resetFilters">
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
  .actionbar-container {
    margin-bottom: 10px;
  }
</style>
