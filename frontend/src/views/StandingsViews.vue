<script setup lang="ts">
import type { Ref } from 'vue'

import { inject, ref } from 'vue'

import ActionBar from '@/components/ActionBar.vue'
import ActivityMonitor from '@/components/ActivityMonitor.vue'
import ModalBackdrop from '@/components/ModalBackdrop.vue'
import { useStandingsStore } from '@/stores/standings'

const standingsStore = useStandingsStore()

const showStanding: Ref<string | null> = ref<string | null>(
    ((standingsByStage): string| null => {
      let firstSheetId = null

      for (const {sheetId} of standingsByStage) {
        firstSheetId = firstSheetId ?? sheetId
      }

      return firstSheetId
    })(standingsStore.standings)
)

const showActivityModal: Ref<boolean> = ref(false)

const requestFixtures = inject('requestFixtures') as Function

const handleDateChange = (e: Event) => {
  const el = e.target as HTMLInputElement
  showStanding.value = el.value
}

const refreshStandings = async (): Promise<void> => {
  showActivityModal.value = true
  await requestFixtures()
  showActivityModal.value = false
}

const filterHeaderVal = (val: string): string => {
  const headValMap: Map<string, string> = new Map([
      ['Position', ''],
      ['Points', 'Pts'],
      ['Try Diff', 'TD'],
      ['Tries For', 'TF'],
  ])

  return headValMap.has(val) ? String(headValMap.get(val)) : val
}

const standingCellWidth = (i: number): string => {
  if (i === 0) {
    return '5%'
  }

  if (i === 1) {
    return '50%'
  }

  return '15%';
}

const filterLineVal = (val: string): string => {
  return val.replace(/^(\d+)([st|nd|rd|th]+\s.*)/gm, '$1')
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
          <option v-for="{sheetId, competition} in standingsStore.standings" :value="sheetId" :key="sheetId">Standings for {{ competition }}</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div v-for="{sheetId, standings} in standingsStore.standings" :key="sheetId">
          <div v-if="sheetId === showStanding">
            <div class="standings-container" v-for="poolStanding in standings" :key="poolStanding.pool">
              <h5>{{ poolStanding.pool }}</h5>
              <table class="table mt-3">
                <tr>
                  <th v-for="(th, i) in poolStanding.standings[0]" class="text-center" :key="i">{{ filterHeaderVal(th) }}</th>
                </tr>
                <tr v-for="(line, i) in poolStanding.standings.slice(1)" :key="i">
                  <td v-for="(td, i) in line" :key="i" class="text-center">{{ filterLineVal(td) }}</td>
                </tr>
              </table>
            </div>
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
