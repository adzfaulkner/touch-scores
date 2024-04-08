import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

import type { Standing, StandingsState } from '@/types'

import {sheetConfigMap, sheetConfigs} from '@/sheet-config'

interface StandingsByStage {
  stage: string
  standings: Standing[]
}

interface StandingsByCompetition {
  isLive: boolean
  date: DateTime
  standings: StandingsByStage[]
}

const stageRegex = /^([^!]+)/

export const useStandingsStore = defineStore('standings', {
  state: (): StandingsState => {
    return {
      standings: [],
      standingsSheetIdMap: new Map(),
    }
  },
  getters: {
    standingsByStage: (state): Map<string, StandingsByCompetition> => {
      const ret: Map<string, StandingsByCompetition>  = new Map()
      const nowStr = DateTime.now().toFormat('d MMMM y')

      for (let [sheetId, standings] of state.standingsSheetIdMap) {
        const date = DateTime.fromISO(sheetConfigMap.get(sheetId).date)

        ret.set(sheetId, {
          date,
          isLive: date.toFormat('d MMMM y') === nowStr,
          standings: standings.map(({ range, values }: { range: string; values: string[][] }) => {
            const stage: string[] = stageRegex.exec(range) as string[]

            return {
              stage: 1 in stage ? stage[1] : '',
              standings: values.map((vals): Standing => {
                const [position, team, points, tdDiff, tdFor] = vals.filter((v) => v !== '')

                return {
                  position: parseInt(position, 10),
                  team,
                  points: parseInt(points, 10),
                  tdDiff: parseInt(tdDiff, 10),
                  tdFor: parseInt(tdFor, 10)
                }
              }).filter(s => !isNaN(s.position))
            }
          })
        })
      }

      return ret
    }
  }
})
