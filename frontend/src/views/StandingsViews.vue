<script setup lang="ts">
import type { Ref } from 'vue'

import { inject, ref } from 'vue'

import ActionBar from '@/components/ActionBar.vue'
import ActivityMonitor from '@/components/ActivityMonitor.vue'
import ModalBackdrop from '@/components/ModalBackdrop.vue'
import { useStandingsStore } from '@/stores/standings'

const standingsStore = useStandingsStore()

const showActivityModal: Ref<boolean> = ref(false)

const requestFixtures = inject('requestFixtures') as Function

const handleDateChange = (e: any) => {
  console.log(e)
}

const refreshStandings = async (): Promise<void> => {
  showActivityModal.value = true
  await requestFixtures()
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
    <div class="row mb-4">
      <div class="col">
        <select class="form-select" @change="handleDateChange">
          <option v-for="[sheetId, { isLive, date }] of standingsStore.standingsByStage" :value="sheetId" :selected="isLive">Standings for {{ date.toFormat('cccc d MMMM y') }}</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div v-for="[sheetId, { standings }] of standingsStore.standingsByStage" :key="sheetId">
          <div class="standings-container" v-for="s in standings" :key="s.stage">
            <h5>{{ s.stage }}</h5>
            <table class="table mt-3">
              <thead class="table-light">
                <tr class="">
                  <th class="pos">&nbsp;</th>
                  <th class="team">Team</th>
                  <th class="pts text-center">PTS</th>
                  <th class="td text-center">TD</th>
                  <th class="td2 text-center">TF</th>
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
      </div>
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
