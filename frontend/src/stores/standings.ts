import { defineStore } from 'pinia'

import type { StandingsBySheet, StandingsState } from '@/types'
import type { FixturesRetrieved } from '@/types-api'

import { sheetConfigMap } from '@/sheet-config'

export const useStandingsStore = defineStore('standings', {
  state: (): StandingsState => {
    return {
      standings: [] as StandingsBySheet[],
      sheetIdStandingsMap: new Map(),
    }
  },
  actions: {
    setValues(data: FixturesRetrieved[]): void {
      const sheetIdStandingsMap: Map<string, number> = new Map()

      const standings: StandingsBySheet[] = data.map((fr: FixturesRetrieved, index: number): StandingsBySheet => {
        sheetIdStandingsMap.set(fr.sheetId, index)
        const competition = String(sheetConfigMap.get(fr.sheetId)?.label)

        return {
          competition,
          sheetId: fr.sheetId,
          standings: fr.poolStandings
        }
      })

      this.sheetIdStandingsMap = sheetIdStandingsMap
      this.standings = standings
    }
  }
})
