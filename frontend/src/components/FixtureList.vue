<script setup lang="ts">
import type { Ref } from 'vue'

import { ref, inject, provide } from 'vue'

import type { FixturesByCompetitionDate, SheetUpdate } from '@/types'

import FixtureListItem from '@/components/FixtureListItem.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFixtureStore } from '@/stores/fixture'

const fixtureStore = useFixtureStore()
const authenticatedStore = useAuthenticationStore()

const updateSheet = inject('updateSheet') as Function

const updates: Ref<Map<string, SheetUpdate>> = ref(new Map())

provide('updates', updates)

const todayFixture = fixtureStore.fixturesByCompetitionDate.find((fbd: FixturesByCompetitionDate) => fbd.isToday)

const openAccordion: Ref<string | null> = ref<string | null>(
  todayFixture ? todayFixture.date.toFormat('d MMMM y') : null
)

const toggleAccordion = (date: string): void => {
  openAccordion.value = date === openAccordion.value ? null : date
}

const accordionButtonClasses = (date: string, comp: string, totalCount: number): string[] => {
  let classes = ['accordion-button', 'bg-gradient', 'fw-bold']

  if (totalCount > 0) {
    classes = [...classes, 'bg-dark-subtle', 'text-black']
  } else {
    classes = [...classes, 'bg-body-tertiary', 'text-black-50']
  }

  if (openAccordion.value !== date) {
    classes.push('collapsed')
  }

  return classes
}

const accordionBgClasses = (): string[] => {
  return ['accordion-body', 'bg-primary-subtle']
}

const fixtureUpdated = () => {
  updateSheet(Array.from(updates.value.values()))
  updates.value.clear()
}

const infoSplit = (info: string): string[] => {
  let parts = info.split('|')
  let first = parts.shift() ?? ''

  return [
      ...first.split(':'),
      ...parts
  ]
}
</script>

<template>
  <div class="mb-3">
    <h6 class="mt-4" v-if="fixtureStore.totalFixturesFound === 0">No fixtures found</h6>
    <div class="accordion" v-else>
      <div
        class="accordion-item"
        v-for="fixtureDate in fixtureStore.fixturesByCompetitionDate"
        :key="fixtureDate.date.toFormat('d MMMM y')"
      >
        <h2 class="accordion-header">
          <button
            :class="
              accordionButtonClasses(
                fixtureDate.date.toFormat('d MMMM y'),
                fixtureDate.competition.name,
                fixtureDate.totalCount
              )
            "
            type="button"
            @click="() => toggleAccordion(fixtureDate.date.toFormat('d MMMM y'))"
          >
            <div :class="['img', `img-${fixtureDate.competition.name}`, 'me-2']"></div>
            {{ fixtureDate.date.toFormat('EEEE d MMMM y') }} ({{ fixtureDate.totalCount }})
          </button>
        </h2>
        <div v-if="openAccordion === fixtureDate.date.toFormat('d MMMM y')">
          <div :class="accordionBgClasses()">
            <h6 v-if="fixtureDate.totalCount < 1">No fixtures found matching filter criteria</h6>
            <div v-else>
              <div class="mb-4">
                <div class="row g-2 ps-3 pe-3 pt-4 pb-4 bg-secondary text-white">
                  <div class="col m-0 text-center">
                    <h5 class="m-0">
                      <span v-for="(i, k) in infoSplit(fixtureDate.competition.info)" v-bind:key="k">{{i}}<br></span>
                    </h5>
                  </div>
                </div>
              </div>
              <div class="mb-4" v-if="fixtureDate.competition.playoffInfo !== null">
                <div class="row g-2 ps-3 pe-3 pt-4 pb-4 bg-playoff text-white">
                  <div class="col m-0 text-center">
                    <h5 class="m-0">
                      <span v-for="(i, k) in infoSplit(fixtureDate.competition.playoffInfo)" v-bind:key="k">{{i}}<br></span>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                class="mb-4"
                v-for="[time, fixtures] in fixtureDate.times"
                :key="time"
              >
                <div class="row g-2 mb-2 bg-danger-subtle">
                  <div class="col text-center">
                    <h3>{{ time }}</h3>
                  </div>
                </div>
                <div class="row row-cols-1 row-cols-lg-2 g-2">
                  <div
                    class="col"
                    v-for="fixture in fixtures"
                    :key="fixture.date + fixture.time + fixture.homeTeam + fixture.awayTeam"
                  >
                    <FixtureListItem
                      :fixture="fixture"
                      :can-edit="authenticatedStore.isAuthenticated"
                      :referees="fixtureStore.refs"
                      :competition="fixtureDate.competition"
                      @fixtureUpdated="fixtureUpdated"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-playoff {
  background-color: #a70000;
}

.slide-item {
  transition: all 1s;
}
.slide-enter {
  opacity: 0;
  transform: translateY(10px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-leave-active {
  position: absolute;
}

.accordion-button {
  font-size: 0.9rem;
  padding: 15px;
}

.accordion-button:focus {
  border: 0 !important;
  box-shadow: none;
}

.img {
  width: 51px;
  height: 60px;
  background-size: cover;
}

.img-nts {
  background-image: url('@/assets/comps/nts.png');
}

.img-dts {
  background-image: url('@/assets/comps/dts.png');
}

.img-nationals {
  background-image: url('@/assets/comps/nationals.png');
}

.img-mw_nts {
  background-image: url('@/assets/comps/mw_nts.png');
}

.img-mixed_nts {
  background-image: url('@/assets/comps/mixed_nts.png');
}

.img-seds {
  background-image: url('@/assets/comps/seds.png');
}

.button-nts {
  background-color: #c4bd97;
  color: black;
}

.accordion-button:after {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000000'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
}

.button-dts {
  background-color: #1c4585;
  color: white;
}

.button-nationals {
  background-color: #3d85c6;
  color: white;
}

.button-mw_nts {
  background-color: #dbe4f0;
  color: black;
}

.button-mixed_nts {
  background-color: #dbe4f0;
  color: black;
}

.button-mixed_nts:after,
.button-nationals:after {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
}

.bg-dts {
  background-color: #a0c5e8;
}

.bg-nts {
  background-color: #93c47d;
}

.bg-nationals {
  background-color: #8db3e2;
}

.bg-mw_nts {
  background-color: #8cb3e3;
}

.bg-mixed_nts {
  background-color: #8cb3e3;
}

.bg-khaki {
  background-color: #c4bd97;
}

.bg-green {
  background-color: #93c47d;
}

.bg-red {
  background-color: #e06666;
}

.bg-blue {
  background-color: #70a7dc;
}
</style>
