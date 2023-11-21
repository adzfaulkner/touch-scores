import { describe, it, assert } from 'vitest'
// @ts-ignore
import type { Fixture } from '../../../src/types'
import { pivotOnV } from '../../../src/support/fixtures'
import { nationals23 } from '../fixtures'

type AggregateTestLine = [string[][], number, string[], string[], string[]]

const NATIONALS23_READ_FROM_CELL = 14

const aggregatesTestLines: AggregateTestLine[] = [
    [
        nationals23,
        NATIONALS23_READ_FROM_CELL,
        ['SATURDAY 29 APRIL 2023', 'SUNDAY 30 APRIL 2023', 'MONDAY 1 MAY 2023'],
        ["9:30","10:20","11:10","12:00","12:50","13:40","14:30","15:00","15:30","16:00","16:50","17:40","9:00","9:50","10:40","11:30","12:25","13:20","14:15","15:10","16:10","17:10","9:55","10:50","11:45","12:40","13:35","16:30"],
        ["FIELD 1","FIELD 2","FIELD 3","FIELD 4","FIELD 5","FIELD 6","FIELD 7","FIELD 8"]
    ],
]

describe('Aggregates raw data', () => {
    it.each(aggregatesTestLines)('Should aggregates expected data into expected shape', (rd: string[][], readFromCell: number, expectedDates: string[], expectedTimes: string[], expectedPitches: string[]): void => {
        const dates = new Set<string>()
        const times = new Set<string>()
        const pitches = new Set<string>()
        const fixtures = new Map<string, Map<string, Fixture[]>>()
        const teams  = new Set<string>()
        const dateFixtureCount = new Map<string, number>()

        const it = pivotOnV(rd, readFromCell, null)
        it(dates, times, pitches, fixtures, teams, new Set<string>(), new Set<string>(), dateFixtureCount)

        assert.deepEqual(expectedDates, Array.from(dates.values()))
        assert.deepEqual(expectedTimes, Array.from(times.values()))
        assert.deepEqual(expectedPitches, Array.from(pitches.values()))
        assert.deepEqual(Array.from(dateFixtureCount.values()), [54, 57, 39])
    })
})