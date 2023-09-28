import type { Fixture } from '@/types'
import type { Aggregated } from '@/support/fixtures'

import { pitchRegex, timeRegex } from '@/support/fixtures'

export const byTapoffTimeAndPitch =
  (columnToLetter: Function, normalizeDate: Function, normalizeRefName: Function) =>
  (
    schedule: string[][],
    refAllocations: string[][],
    readingFromCell: number,
    competition: string,
    date: string | null
  ): Aggregated =>
  (
    dates: Set<string>,
    times: Set<string>,
    pitches: Set<string>,
    fixtures: Fixture[],
    teams: Set<string>,
    stages: Set<string>,
    refs: Set<string>,
    competitions: Set<string>
  ): void => {
    competitions.add(competition)

    const datesArr = []

    if (date !== null) {
      dates.add(normalizeDate(date))
      datesArr.push(normalizeDate(date))
    }

    // create a series of maps to make
    const refPitchMap = new Map()
    const schedulePitchMap = new Map()
    const refTimeMap = new Map()
    const tapOffTimeMap = new Map()

    for (let c: number = 0; c < schedule[0].length; c++) {
      if (pitchRegex.test(schedule[0][c])) {
        schedulePitchMap.set(c, schedule[0][c].trim())
      }
    }

    for (let c: number = 0; c < refAllocations[0].length; c++) {
      if (pitchRegex.test(refAllocations[0][c])) {
        refPitchMap.set(refAllocations[0][c].trim(), c)
      }
    }

    for (let r: number = 0; r < schedule.length; r++) {
      if (timeRegex.test(schedule[r][0])) {
        tapOffTimeMap.set(r, schedule[r][0].trim())
      }
    }

    for (let r: number = 0; r < refAllocations.length; r++) {
      if (timeRegex.test(refAllocations[r][0])) {
        refTimeMap.set(refAllocations[r][0].trim(), r)
      }
    }

    const filterVal = (val: undefined | string): string => String(val).trim()
    const lookupRef = (r: number, c: number): string =>
      refAllocations[r][c] !== undefined ? normalizeRefName(refAllocations[r][c]) : ''

    // loop through times and pitches to generate the fixture list
    for (const row of tapOffTimeMap.keys()) {
      for (const col of schedulePitchMap.keys()) {
        if (schedule[row][col] === undefined) {
          continue
        }

        const stage = filterVal(schedule[row][col])
        const pitch = filterVal(schedulePitchMap.get(col))
        const time = filterVal(tapOffTimeMap.get(row))

        if (stage === '') {
          continue
        }

        const tmp: Fixture = {
          date: filterVal(datesArr[datesArr.length - 1]),
          time,
          competition: filterVal(competition),
          stage,
          pitch,
          homeTeam: filterVal(schedule[row + 1][col]),
          homeTeamScore:
            schedule[row + 1][col + 1] === undefined ? '' : schedule[row + 1][col + 1].trim(),
          homeTeamScoreRange: `${columnToLetter(col + 2)}${readingFromCell + (row + 1)}`,
          awayTeam: filterVal(schedule[row + 2][col]),
          awayTeamScore:
            schedule[row + 2][col + 1] === undefined ? '' : schedule[row + 2][col + 1].trim(),
          awayTeamScoreRange: `${columnToLetter(row + 2)}${readingFromCell + (row + 2)}`,
          ref1: lookupRef(refTimeMap.get(time) + 1, refPitchMap.get(pitch)),
          ref1Range: `${columnToLetter(col - 2)}${readingFromCell + (row + 1)}`,
          ref2: lookupRef(refTimeMap.get(time) + 2, refPitchMap.get(pitch)),
          ref2Range: `${columnToLetter(col + 3)}${readingFromCell + (row + 1)}`,
          ref3: lookupRef(refTimeMap.get(time) + 3, refPitchMap.get(pitch)),
          ref3Range: `${columnToLetter(col)}${readingFromCell + (row + 1)}`
        }

        fixtures.push(tmp)

        dates.add(tmp.date)
        times.add(tmp.time)
        competitions.add(tmp.competition)
        stages.add(tmp.stage)
        pitches.add(tmp.pitch)
        teams.add(tmp.homeTeam)
        teams.add(tmp.awayTeam)
        refs.add(tmp.ref1)
        refs.add(tmp.ref2)
        refs.add(tmp.ref3)
      }
    }
  }
