<script setup lang="ts">
import type { Fixture } from '@/types'
import type { PropType, Ref } from 'vue'

import { inject } from 'vue'

import type { SheetUpdate } from '@/types'

import { debounce } from '@/support/debounce'
import { getCardHeaderStyle } from '@/support/card-header'

const emit = defineEmits(['fixtureUpdated'])

defineProps({
  canEdit: Boolean,
  referees: { type: Array as PropType<string[]>, required: true },
  fixture: { type: Object as PropType<Fixture>, required: true },
  sheetId: { type: String as PropType<string>, required: true }
})

const updates = inject('updates') as Ref<Map<string, SheetUpdate>>

const scoreClasses = (stage: string, defaults: string[]): string[] => {
  const ret = [...defaults, 'pt-2', 'pb-2', 'text-center', 'fw-bold', 'bg-default']

  /**
  const s = stage.toLowerCase()

  if (s.substring(0, 9) === 'cup final') {
    ret.push('bg-cup-f')
  } else if (s.substring(0, 10) === '3rd / 4th ') {
    ret.push('bg-cup-po')
  } else if (s.substring(0, 15) === 'cup semi final ') {
    ret.push('bg-cup-sf')
  } else if (s.substring(0, 11) === 'plate final') {
    ret.push('bg-plate-f')
  } else if (s.substring(0, 10) === '7th / 8th ') {
    ret.push('bg-plate-po')
  } else if (s.substring(0, 6) === 'plate ') {
    ret.push('bg-plate-sf')
  } else if (s.substring(0, 10) === 'bowl final') {
    ret.push('bg-bowl-f')
  } else if (s.substring(0, 10) === '11th/12th ') {
    ret.push('bg-bowl-po')
  } else if (s.substring(0, 5) === 'bowl ') {
    ret.push('bg-bowl-sf')
  } else {
    ret.push('bg-default')
  }
   */

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
  <div class="card h-100 rounded-0">
    <div :class="['card-header', 'text-center', 'fw-bold']" :style="getCardHeaderStyle(fixture.stage)">{{ fixture.time }} - {{ fixture.pitch }} - {{ fixture.stage }}</div>
    <div class="card-body p-0 m-0">
      <div class="ps-2 fs-5">
        <div class="d-flex">
          <div class="d-flex align-items-center flex-grow-1 me-2">
            <span class="fs-6">{{ fixture.homeTeam }}</span>
          </div>
          <div>
            <input
              type="number"
              :class="scoreClasses(fixture.stage, ['form-control', 'score-input'])"
              :value="fixture.homeTeamScore"
              @keyup="(e: Event) => fixtureUpdate(e, sheetId, fixture.homeTeamScoreRange)"
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
          <div>
            <input
              type="number"
              :class="scoreClasses(fixture.stage, ['form-control', 'score-input'])"
              :value="fixture.awayTeamScore"
              @keyup="(e: Event) => fixtureUpdate(e, sheetId, fixture.awayTeamScoreRange)"
              v-if="canEdit"
            />
            <div :class="scoreClasses(fixture.stage, ['score'])" v-else>
              {{ fixture.awayTeamScore === '' ? '&nbsp;' : fixture.awayTeamScore }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="canEdit || fixture.ref1 !== '' || fixture.ref2 !== '' || fixture.ref3 !== ''">
        <div class="row">
          <div class="col">
            <span class="fw-bold">Referees</span>
          </div>
        </div>
        <div class="row">
          <div class="col col-12 col-sm-6">
            <select
              class="form-select"
              :value="fixture.ref1"
              @change="(e: Event) => fixtureUpdate(e, sheetId, fixture.ref1Range)"
              v-if="false"
            >
              <option v-for="referee in referees" :key="referee">{{ referee }}</option>
            </select>
            <span class="text-danger fst-italic fw-bold fs-6" v-else>{{ fixture.ref1 }}</span>
          </div>
          <div class="col col-12 col-sm-6">
            <select
              class="form-select"
              :value="fixture.ref2"
              @change="(e: Event) => fixtureUpdate(e, sheetId, fixture.ref2Range)"
              v-if="false"
            >
              <option v-for="referee in referees" :key="referee">{{ referee }}</option>
            </select>
            <span class="text-danger fst-italic fw-bold" v-else>{{ fixture.ref2 }}</span>
          </div>
          <div class="col col-12 col-sm-6">
            <select
                class="form-select"
                :value="fixture.ref3"
                @change="(e: Event) => fixtureUpdate(e, sheetId, fixture.ref3Range)"
                v-if="false"
            >
              <option v-for="referee in referees" :key="referee">{{ referee }}</option>
            </select>
            <span class="text-danger fst-italic fw-bold" v-else>{{ fixture.ref3 }}</span>
          </div>
        </div>
      </div>
      <div class="row" v-if="fixture.videoUrl !== ''">
        <div class="col">
          <div class="mt-0">
            <a class="btn btn-primary btn-lg w-100 rounded-0" :href="fixture.videoUrl" target="_blank">
              <i class="bi bi-camera-video-fill"></i> Watch Stream
            </a>
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

.bg-bowl-f {
  background-color: #ec7866;
}

.bg-bowl-po {
  background-color: #f89498;
}

.bg-bowl-sf {
  background-color: #fec9cb;
}

.bg-default {
  /*background-color: #cce3f6;*/
  background-color: #a5a5a5;
}

.card-header {
  /*background-color: #fff3cc;*/
}
</style>
