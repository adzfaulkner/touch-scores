<script setup lang="ts">
import type { Ref } from 'vue'

import { ref } from 'vue'
import escapeStringRegexp from 'escape-string-regexp'

import { useFilterStore } from '@/stores/filters'
import { useFixtureStore } from '@/stores/fixture'
import { FilterBy } from '@/types'

const globalSearchTxt = ref<HTMLInputElement>()
const globalSearchSuggestionsList = ref<HTMLDivElement>()
const globalSearchResetBtn = ref<HTMLInputElement>()

const filtersStore = useFilterStore()

const globalSuggestions: Ref<string[]> = ref([])
const showGlobalSuggestions: Ref<boolean> = ref(false)

const filterByTime = FilterBy.Time
const filterByRef = FilterBy.Ref
const filterByPitch = FilterBy.Pitch
const filterByStage = FilterBy.Stage
const filterByTeam = FilterBy.Team
const filterByGlobal = FilterBy.Global

const filterFixtures = (event: Event, by: FilterBy): void => {
  filtersStore.filterBy(by, [(event.target as HTMLInputElement).value])
}

const resetGlobal = (): void => {
  filtersStore.globalValue = ''
  filtersStore.filterBy(filterByGlobal, [''])
}

const findSuggestions = (e: Event): void => {
  const value = String((e.target as HTMLInputElement).value).trim()
  filtersStore.globalValue = (e.target as HTMLInputElement).value

  if (value.length < 2) {
    globalSuggestions.value = []
    showGlobalSuggestions.value = false
    return
  }

  const potentials = [
    ...filtersStore.values.teams,
    ...filtersStore.values.referees,
    ...filtersStore.values.stages,
    ...filtersStore.values.pitches,
    ...filtersStore.values.times,
  ]

  const searchForRegExp = new RegExp(escapeStringRegexp(value), 'i')

  globalSuggestions.value = [
    ...[value],
    ...new Set(potentials.filter((potential: string) => searchForRegExp.test(potential)).sort())
  ]

  showGlobalSuggestions.value = true
}

const renderSuggestion = (suggestion: string): string => {
  const suggestionReplaceRegex = new RegExp(
    '(' + escapeStringRegexp(filtersStore.globalValue) + ')',
    'i'
  )
  return suggestion.replace(suggestionReplaceRegex, '<b>$1</b>')
}

const acceptSuggestion = (suggestion: string): void => {
  filtersStore.globalValue = suggestion
  showGlobalSuggestions.value = false
  filtersStore.filterBy(filterByGlobal, [suggestion])
}

const timesSorted = (times: Set<string>): string[] => {
  return Array.from(times).sort((a: string, b: string): number => {
    const A: number = parseInt(a.replace(':', ''), 10)
    const B: number = parseInt(b.replace(':', ''), 10)

    return A - B
  })
}

document.addEventListener('click', (event: Event) => {
  const target: HTMLInputElement = event.target as HTMLInputElement

  if (
    target === globalSearchTxt.value ||
    (target.parentElement instanceof HTMLDivElement &&
      target.parentElement === globalSearchSuggestionsList.value)
  ) {
    return
  }

  showGlobalSuggestions.value = false
})
</script>

<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">Quick all field search</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            :value="filtersStore.globalValue"
            @keyup="findSuggestions"
            @change="findSuggestions"
            @focus="findSuggestions"
            ref="globalSearchTxt"
          />
          <button
            type="button"
            class="btn bg-transparent btn-input-reset"
            @click="resetGlobal"
            ref="globalSearchResetBtn"
          >
            <i class="bi bi-backspace"></i>
          </button>
        </div>
        <div class="input-group" v-if="showGlobalSuggestions">
          <div ref="globalSearchSuggestionsList" class="list-group suggestions">
            <a
              @click="() => acceptSuggestion(suggestion)"
              class="list-group-item list-group-item-action list-group-item-secondary"
              v-for="suggestion in globalSuggestions"
              v-html="renderSuggestion(suggestion)"
              :key="suggestion"
            >
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">By Team</label>
        <select class="form-select" @change="(e: Event) => filterFixtures(e, filterByTeam)">
          <option value="">--ALL--</option>
          <option
            v-for="option in filtersStore.values.teams"
            :key="option"
            :selected="filtersStore.filtersApplied.team.includes(option)"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">By Referee</label>
        <select class="form-select" @change="(e: Event) => filterFixtures(e, filterByRef)">
          <option value="">--ALL--</option>
          <option
            v-for="option in filtersStore.values.referees"
            :key="option"
            :selected="filtersStore.filtersApplied.ref.includes(option)"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">By Time</label>
        <select class="form-select" @change="(e: Event) => filterFixtures(e, filterByTime)">
          <option value="">--ALL--</option>
          <option
            v-for="option in filtersStore.values.times"
            :key="option"
            :selected="filtersStore.filtersApplied.time.includes(option)"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">By Pitch</label>
        <select class="form-select" @change="(e: Event) => filterFixtures(e, filterByPitch)">
          <option value="">--ALL--</option>
          <option
            v-for="option in filtersStore.values.pitches"
            :key="option"
            :selected="filtersStore.filtersApplied.pitch.includes(option)"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label class="form-label">By Stage</label>
        <select class="form-select" @change="(e: Event) => filterFixtures(e, filterByStage)">
          <option value="">--ALL--</option>
          <option
            v-for="option in filtersStore.values.stages"
            :key="option"
            :selected="filtersStore.filtersApplied.stage.includes(option)"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-btn {
  position: absolute;
  width: 10px;
  font-weight: 550;
  border: none;
  background-color: transparent;
  line-height: 35px;
  left: calc(100% - 30px);
  z-index: 99999;
}

.inner-btn:hover {
  color: blue;
}

.btn-input-reset {
  margin-left: -40px !important;
  z-index: 100 !important;
}

.suggestions {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 100;
  position: absolute;
  max-height: 400px;
  width: 100%;
}
</style>
