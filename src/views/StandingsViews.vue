<script setup lang="ts">
import type { Ref } from 'vue'

import { inject, ref } from 'vue'

import ActionBar from '@/components/ActionBar.vue'
import ActivityMonitor from '@/components/ActivityMonitor.vue'
import ModalBackdrop from '@/components/ModalBackdrop.vue'
import { useStandingsStore } from '@/stores/standings'

const standingsStore = useStandingsStore()

const showActivityModal: Ref<boolean> = ref(false)

const loadFixtures = inject('loadFixtures') as Function

const refreshStandings = async (): Promise<void> => {
  showActivityModal.value = true
  await loadFixtures()
  showActivityModal.value = false
}
</script>

<template>
  <div class="actionbar-container sticky-top bg-white">
    <ActionBar>
      <button
        class="btn btn-lg text-primary fw-bold border-0"
        type="button"
        @click="refreshStandings"
      >
        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
      </button>
    </ActionBar>
  </div>
  <div class="container">
    <div class="standings-container" v-for="s in standingsStore.standingsByStage" :key="s.stage">
      <h5>{{ s.stage }}</h5>
      <table class="table mt-3">
        <thead class="table-light">
          <tr class="">
            <th class="pos">&nbsp;</th>
            <th class="team">Team</th>
            <th class="pts text-center">Pts</th>
            <th class="td text-center">TD</th>
            <th class="td2 text-center">TS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="standing in s.standings" :key="standing.team">
            <td class="text-center">{{ standing.position }}</td>
            <td>{{ standing.team }}</td>
            <td class="text-center">{{ standing.points }}</td>
            <td class="text-center">{{ standing.tdDiff }}</td>
            <td class="text-center">{{ standing.tdFor }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ActivityMonitor :open="showActivityModal" />
  <ModalBackdrop :open="showActivityModal" />
</template>

<style scoped>
.standings-container {
  margin-bottom: 40px;
}

.pos {
  width: 10%;
}

.team {
  width: 60%;
}

.pts,
.td,
.td2 {
  width: 10%;
}

td {
  padding: 5px 0;
}

.actionbar-container {
  margin-bottom: 10px;
}
</style>
