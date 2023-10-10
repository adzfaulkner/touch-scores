<script setup lang="ts">
  import type { Ref } from 'vue'

  import { inject, ref } from 'vue'
  import ActionBar from '@/components/ActionBar.vue'
  import ActivityMonitor from '@/components/ActivityMonitor.vue'
  import FixtureFilter from '@/components/FixtureFilter.vue'
  import FixtureList from '@/components/FixtureList.vue'
  import ModalBackdrop from '@/components/ModalBackdrop.vue'
  import ModalView from '@/components/ModalView.vue'
  import { useFixtureStore } from '@/stores/fixture'

  const loadFixtures = inject('loadFixtures') as Function

  const fixtureStore = useFixtureStore()

  const showModal: Ref<boolean> = ref(false)
  const showActivityModal: Ref<boolean> = ref(false)

  const noOfResults = (): number => {
    return fixtureStore.totalFixturesFound
  }

  const toggleModal = (): void => {
    showModal.value = !showModal.value
  }

  const refreshFixtures = async (): Promise<any> => {
    showActivityModal.value = true
    await loadFixtures()
    showActivityModal.value = false
  }
</script>

<template>
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
  <div class="actionbar-container fixed-bottom">
    <ActionBar>
      <button class="btn text-white" type="button" @click="toggleModal">
        <i class="bi bi-filter me-1"></i>Filter
      </button>
      <button class="btn text-white" type="button" @click="refreshFixtures">
        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
      </button>
    </ActionBar>
  </div>
</template>

<style scoped>
  .actionbar-container {
    margin-bottom: 62px;
  }
</style>
