<script setup lang="ts">
import type { Ref } from 'vue'

import { ref, inject, provide } from 'vue'

import type {FixturesBySheetDate, SheetUpdate} from '@/types'

import FixtureListItem from '@/components/FixtureListItem.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { useFixtureStore } from '@/stores/fixture'

const fixtureStore = useFixtureStore()
const authenticatedStore = useAuthenticationStore()

const updateSheet = inject('updateSheet') as Function

const updates: Ref<Map<string, SheetUpdate>> = ref(new Map())

provide('updates', updates)

const todayFixture: FixturesBySheetDate | undefined = fixtureStore.fixturesBySheetDates.find((fbd: FixturesBySheetDate) => fbd.isToday)

const openAccordion: Ref<string | null> = ref<string | null>(
  todayFixture ? todayFixture.date.toFormat('d MMMM y') : null
)

const toggleAccordion = (date: string): void => {
  openAccordion.value = date === openAccordion.value ? null : date
}

const accordionButtonClasses = (date: string, comp: string, totalCount: number): string[] => {
  let classes = ['accordion-button', 'bg-gradient', 'fw-bold']

  if (totalCount > 0) {
    classes = [...classes, 'accordion-button-bg-' + comp, 'text-black']
  } else {
    classes = [...classes, 'bg-body-tertiary', 'text-black-50']
  }

  if (openAccordion.value !== date) {
    classes.push('collapsed')
  }

  return classes
}

const accordionBgClasses = (): string[] => {
  return ['accordion-body', 'accordion-bg']
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
  ].map(s => s.trim())
}
</script>

<template>
  <div class="mb-3">
    <h6 class="mt-4" v-if="fixtureStore.totalFixturesFound === 0">No fixtures found</h6>
    <div class="accordion" v-else>
      <div
        class="accordion-item"
        v-for="fixturesBySheetDate of fixtureStore.fixturesBySheetDates"
        :key="fixturesBySheetDate.date.toFormat('d MMMM y')"
      >
        <h2 class="accordion-header">
          <button
            :class="
              accordionButtonClasses(
                fixturesBySheetDate.date.toFormat('d MMMM y'),
                fixturesBySheetDate.comp,
                fixturesBySheetDate.totalCount
              )
            "
            type="button"
            @click="() => toggleAccordion(fixturesBySheetDate.date.toFormat('d MMMM y'))"
          >
            <div :class="['img', `img-${fixturesBySheetDate.comp}`, 'me-2']"></div>
            {{ fixturesBySheetDate.date.toFormat('EEEE d MMMM y') }} ({{ fixturesBySheetDate.totalCount }})
          </button>
        </h2>
        <div v-if="openAccordion === fixturesBySheetDate.date.toFormat('d MMMM y')">
          <div :class="accordionBgClasses()">
            <h6 v-if="fixturesBySheetDate.totalCount < 1">No fixtures found matching filter criteria</h6>
            <div v-else>
              <div class="mb-4">
                <div class="row g-2 ps-3 pe-3 pt-4 pb-4 bg-secondary text-white">
                  <div class="col m-0 text-center">
                    <h5 class="m-0">
                      <span v-for="(i, k) in infoSplit(fixturesBySheetDate.slotInfo)" v-bind:key="k">{{i}}<br></span>
                    </h5>
                  </div>
                </div>
              </div>
              <div class="mb-4" v-if="fixturesBySheetDate.playOffSlotInfo !== ''">
                <div class="row g-2 ps-3 pe-3 pt-4 pb-4 bg-playoff text-white">
                  <div class="col m-0 text-center">
                    <h5 class="m-0">
                      <span v-for="(i, k) in infoSplit(fixturesBySheetDate.playOffSlotInfo)" v-bind:key="k">{{i}}<br></span>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                class="mb-4"
                v-for="fixturesByTime of fixturesBySheetDate.fixturesByTime"
                :key="fixturesByTime.time"
              >
                <div class="row g-2 mb-2 bg-danger-subtle">
                  <div class="col text-center">
                    <h3>{{ fixturesByTime.time }}</h3>
                  </div>
                </div>
                <div class="row row-cols-1 row-cols-lg-2 g-2">
                  <div
                    class="col"
                    v-for="fixture of fixturesByTime.fixtures"
                    :key="fixturesBySheetDate.date + fixture.time + fixture.homeTeam + fixture.awayTeam"
                  >
                    <FixtureListItem
                      :fixture="fixture"
                      :can-edit="authenticatedStore.isAuthenticated"
                      :referees="fixtureStore.refs"
                      :sheet-id="fixturesBySheetDate.sheetId"
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

.img-mw_nts_12 {
  background-image: url('@/assets/comps/mw_nts_12.png');
}

.img-mw_nts_34 {
  background-image: url('@/assets/comps/mw_nts_34.png');
}

.button-nts {
  background-color: #c4bd97;
  color: black;
}

.accordion-button-bg-mw_nts_12 {
  background-color: #c4ad74;
}

.accordion-button-bg-mw_nts_34 {
  background-color: #ff5189;
}

.accordion-bg {
  background-color: #3373ca;
}
ff5189

.accordion-button:after {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000000'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
}
</style>
