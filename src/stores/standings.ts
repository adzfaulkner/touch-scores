import { defineStore } from 'pinia'

import type { Standing } from '@/types';

interface StandingsByCompetition {
    stage: string
    standings: Standing[]
}

const stageRegex = /^'([^']+)/;

export const useStandingsStore = defineStore('standings', {
    state: () => {
        return {
            standings: []
        }
    },
    getters: {
        standingsByStage: (state): StandingsByCompetition[] => {
            return state.standings.map(({ range, values }: { range: string, values: string[][] }) => {
                const stage: string[] = stageRegex.exec(range) as string[]

                return {
                    stage: 1 in stage ? stage[1]: '',
                    standings: values.map((vals): Standing => {
                        const [ position, team, points, tdDiff, tdFor ] = vals.filter(v => v !== '')

                        return {
                            position: parseInt(position, 10),
                            team,
                            points: parseInt(points, 10),
                            tdDiff: parseInt(tdDiff, 10),
                            tdFor: parseInt(tdFor, 10),
                        }
                    })
                }
            })
        }
    }
})
