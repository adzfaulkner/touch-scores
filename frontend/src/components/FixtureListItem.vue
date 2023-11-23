<script setup lang="ts">
import type {Competition, Fixture} from '@/types'
import type { PropType, Ref } from 'vue'

import type { SheetUpdate } from '@/stores/fixture'

import { inject } from 'vue'

import { debounce } from '@/support/debounce'

const emit = defineEmits(['fixtureUpdated'])

defineProps({
  canEdit: Boolean,
  referees: { type: Set as PropType<Set<string>>, required: true },
  fixture: { type: Object as PropType<Fixture>, required: true },
  competition: { type: Object as PropType<Competition>, required: true }
})

const updates = inject('updates') as Ref<Map<string, SheetUpdate>>

const scoreClasses = (stage: string, defaults: string[]): string[] => {
  const ret = [...defaults, 'pt-2', 'pb-2', 'text-center', 'fw-bold']

  const s = stage.toLowerCase()

  if (s.substring(0, 9) === 'cup final') {
    ret.push('bg-cup-f')
  } else if (s.substring(0, 8) === '3rd/4th ') {
    ret.push('bg-cup-po')
  } else if (s.substring(0, 4) === 'cup ') {
    ret.push('bg-cup-sf')
  } else if (s.substring(0, 11) === 'plate final') {
    ret.push('bg-plate-f')
  } else if (s.substring(0, 8) === '7th/8th ') {
    ret.push('bg-plate-po')
  } else if (s.substring(0, 6) === 'plate ') {
    ret.push('bg-plate-sf')
  } else {
    ret.push('bg-default')
  }

  return ret
}

const fixtureUpdate = (event: Event, sheetId: string, range: string): void => {
  const value = (event.target as HTMLInputElement).value

  updates.value.set(range, { value, range, sheetId })

  debounce(() => {
    emit('fixtureUpdated')
  }, 2000)()
}
</script>

<template>
  <div class="card">
    <div class="card-header text-center">{{ fixture.time }} - {{ fixture.pitch }}</div>
    <div class="card-body p-3">
      <h5 class="card-title text-center h6 p-2">{{ fixture.stage }}</h5>
      <div class="fs-5">
        <div class="d-flex">
          <div class="d-flex align-items-center flex-grow-1 me-2">
            <span class="fs-6">{{ fixture.homeTeam }}</span>
          </div>
          <div class="pt-2 pb-2">
            <input
              type="number"
              :class="scoreClasses(fixture.stage, ['form-control', 'score-input'])"
              :value="fixture.homeTeamScore"
              @keyup="(e: Event) => fixtureUpdate(e, competition.sheetId, fixture.homeTeamScoreRange)"
              v-if="canEdit"
            />
            <div :class="scoreClasses(fixture.stage, ['score'])" v-else>
              {{ fixture.homeTeamScore === '' ? '&nbsp;' : fixture.homeTeamScore }}
            </div>
          </div>
        </div>
        <div class="d-flex">
          <div class="d-flex align-items-center flex-grow-1 me-2">
            <span class="fs-6">{{ fixture.awayTeam }}</span>
          </div>
          <div class="pt-2 pb-2">
            <input
              type="number"
              :class="scoreClasses(fixture.stage, ['form-control', 'score-input'])"
              :value="fixture.awayTeamScore"
              @keyup="(e: Event) => fixtureUpdate(e, competition.sheetId, fixture.awayTeamScoreRange)"
              v-if="canEdit"
            />
            <div :class="scoreClasses(fixture.stage, ['score'])" v-else>
              {{ fixture.awayTeamScore === '' ? '&nbsp;' : fixture.awayTeamScore }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-1">
        <div class="row">
          <div class="col">
            <span class="fw-bold">Referees</span>
          </div>
        </div>
        <div class="row">
          <div class="col col-12 col-sm-6 pt-1">
            <select
              class="form-select"
              :value="fixture.ref1"
              @change="(e: Event) => fixtureUpdate(e, competition.sheetId, fixture.ref1Range)"
              v-if="canEdit"
            >
              <option v-for="referee in referees" :key="referee">{{ referee }}</option>
            </select>
            <span class="text-danger fst-italic fw-bold fs-6" v-else>{{ fixture.ref1 }}</span>
          </div>
          <div class="col col-12 col-sm-6 pt-2">
            <select
              class="form-select"
              :value="fixture.ref3"
              @change="(e: Event) => fixtureUpdate(e, competition.sheetId, fixture.ref3Range)"
              v-if="canEdit"
            >
              <option v-for="referee in referees" :key="referee">{{ referee }}</option>
            </select>
            <span class="text-danger fst-italic fw-bold" v-else>{{ fixture.ref3 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score {
  width: 60px;
}

.score-input {
  width: 90px;
  background-color: white !important;
  height: 60px;
}

.bg-cup-f {
  background-color: #ffd74c;
}

.bg-cup-po {
  background-color: #ffe48e;
}

.bg-cup-sf {
  background-color: #fff2c7;
}

.bg-plate-f {
  background-color: #cccccc;
}

.bg-plate-po {
  background-color: #d9d9da;
}

.bg-plate-sf {
  background-color: #efefef;
}

.bg-default {
  background-color: #cce3f6;
}
</style>
