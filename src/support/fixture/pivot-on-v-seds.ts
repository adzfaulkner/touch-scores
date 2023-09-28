import type { Fixture } from '@/types'
import { dateRegex, timeRegex, pitchRegex } from '@/support/fixtures'
import type { Aggregated } from '@/support/fixtures'

export const pivotOnVSeds =
  (columnToLetter: Function, normalizeDate: Function, normalizeRefName: Function) =>
  (
    data: string[][],
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
    const pitchMap = new Map()
    competitions.add(competition)

    const datesArr = []
    const timesArr = []

    if (date !== null) {
      datesArr.push(normalizeDate(date))
      dates.add(normalizeDate(date))
    }

    for (let r: number = 0; r < data.length; r++) {
      for (let c: number = 0; c < data[r].length; c++) {
        if (date === null && dateRegex.test(data[r][c])) {
          datesArr.push(normalizeDate(data[r][c].trim()))
          dates.add(normalizeDate(data[r][c].trim()))
          continue
        }

        if (timeRegex.test(data[r][c])) {
          timesArr.push(data[r][c].trim())
          times.add(data[r][c].trim())
          continue
        }

        if (pitchRegex.test(data[r][c])) {
          pitchMap.set(c, data[r][c].trim())
          pitches.add(data[r][c].trim())
          continue
        }

        if (data[r][c].trim().toLowerCase() !== 'v') {
          continue
        }

        const tmp: Fixture = {
          date: datesArr[datesArr.length - 1].trim(),
          time: timesArr[timesArr.length - 1].trim(),
          competition,
          stage: data[r - 1][c - 3].trim(),
          pitch: String(pitchMap.get(c - 3)),
          homeTeam: data[r][c - 3].trim(),
          homeTeamScore: data[r][c - 1].trim(),
          homeTeamScoreRange: `${columnToLetter(c)}${readingFromCell + r}`,
          awayTeam: data[r][c + 2].trim(),
          awayTeamScore: data[r][c + 1].trim(),
          awayTeamScoreRange: `${columnToLetter(c + 2)}${readingFromCell + r}`,
          ref1:
            data[r + 1] === undefined || data[r + 1][c - 4] === undefined
              ? ''
              : normalizeRefName(data[r + 1][c - 3]),
          ref1Range: `${columnToLetter(c - 2)}${readingFromCell + (r + 1)}`,
          ref2:
              data[r + 1] === undefined || data[r + 1][c - 1] === undefined
                  ? ''
                  : normalizeRefName(data[r + 1][c - 1]),
          ref2Range: `${columnToLetter(c)}${readingFromCell + (r + 1)}`,
          ref3:
            data[r + 1] === undefined || data[r + 1][c + 2] === undefined
              ? ''
              : normalizeRefName(data[r + 1][c + 2]),
          ref3Range: `${columnToLetter(c + 2)}${readingFromCell + (r + 1)}`,
        }

        fixtures.push(tmp)

        teams.add(tmp.homeTeam)
        teams.add(tmp.awayTeam)
        stages.add(tmp.stage)
        refs.add(tmp.ref1)
        refs.add(tmp.ref2)
        refs.add(tmp.ref3)
      }
    }
  }
