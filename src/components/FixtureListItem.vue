<script setup lang="ts">
import type { PropType } from 'vue'

import type { Fixture } from '@/types'

defineProps({
  fixture: { type: Object as PropType<Fixture>, required: true }
})

const scoreClasses = (): string[] => {
  const classes = ['score', 'pt-2', 'pb-2', 'text-center', 'fw-bold']

  /**
    const laterRound = /^(cup|plate|bowl)\s/i
    const segs: RegExpMatchArray | null = stage.match(laterRound)

    const placePlayOff = /\/(\d+)(st|nd|rd|th)\splay-off$/i
    const segs2: RegExpMatchArray | null = stage.match(placePlayOff)

    if (segs?.length !== undefined) {
      const majorOrMinor = stage.toLowerCase().includes('play-off') ? 'minor' : 'major'
      classes.push(`score-${segs[1].toLowerCase()}-${majorOrMinor}`)
    } else if (segs2?.length !== undefined) {
      classes.push(`score-${['cup', 'plate', 'bowl'][Math.ceil(Number(segs2[1]) / 8) - 1]}-minor`)
    } else {
      classes.push('bg-secondary-subtle')
    }
     */

  classes.push('bg-secondary-subtle')

  return classes
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
            <div :class="scoreClasses(fixture.stage)">
              {{ fixture.homeTeamScore === '' ? '&nbsp;' : fixture.homeTeamScore }}
            </div>
          </div>
        </div>
        <div class="d-flex">
          <div class="d-flex align-items-center flex-grow-1 me-2">
            <span class="fs-6">{{ fixture.awayTeam }}</span>
          </div>
          <div class="pt-2 pb-2">
            <div :class="scoreClasses(fixture.stage)">
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
          <div class="col col-4 col-lg-4 pt-1">
            <span class="text-danger fst-italic fw-bold fs-6">{{
              fixture.ref1 !== '' ? fixture.ref1 : 'TBA'
            }}</span>
          </div>
          <div class="col col-4 col-lg-4 pt-2">
            <span class="text-danger fst-italic fw-bold">{{
              fixture.ref2 !== '' ? fixture.ref2 : 'TBA'
            }}</span>
          </div>
          <div class="col col-4 col-lg-4 pt-2">
            <span class="text-danger fst-italic fw-bold">{{
              fixture.ref3 !== '' ? fixture.ref3 : 'TBA'
            }}</span>
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

.score-cup-major {
  background-color: #ffd966;
}

.score-cup-minor {
  background-color: #ffe598;
}

.score-plate-final {
  background-color: #999999;
}

.score-bowl-major {
  background-color: #cd4025;
}

.score-bowl-minor {
  background-color: #dd7e6b;
}

.score-plate-major {
  background-color: #999999;
}

.score-plate-minor {
  background-color: #b7b7b7;
}
</style>
