import type {Filters, Fixture} from '../../src/types'

import { describe, it, assert } from 'vitest'
import { DateTime } from 'luxon'
import { aggregateRawData, filterFixtures, byTapoffTimeAndPitch } from '../../src/support/fixtures'
import { nts_schedule, nts_refAllocs } from './fixtures'

const dateIso: string = '2023-07-01T00:00:00+00:00'
const readFromCell: number = 13

const aggregator = byTapoffTimeAndPitch(
    nts_schedule,
    nts_refAllocs,
    readFromCell,
    DateTime.fromISO(dateIso).toFormat('cccc d MMMM y').toUpperCase()
)

const { fixtures } = aggregateRawData(aggregator)

const extraFixtureProps = (cb: Function, result: Map<string, Map<string, Fixture[]>>) => {
    result.forEach((times) => {
        times.forEach((fixs) => {
            fixs.forEach((fix) => cb(fix))
        })
    })
}

describe('filters fixtures', () => {
    it('Should return all fixtures if no filters defined', (): void => {
        const filters: Filters = {
            date: [],
            time: [],
            pitch: [],
            stage: [],
            team: [],
            ref: [],
            global: [],
        }

        const { result, total } = filterFixtures(fixtures, filters)

        assert.deepEqual(fixtures, result)
        assert.equal(total, 72)
    })

    it('Should filter by date', (): void => {
        const filters: Filters = {
            date: ['SATURDAY 1 JULY 2023'],
            time: [],
            pitch: [],
            stage: [],
            team: [],
            ref: [],
            global: [],
        }

        const { result } = filterFixtures(fixtures, filters)

        const dates = new Set()
        extraFixtureProps(
            (fix: Fixture) => dates.add(fix.date),
            result
        )

        assert.deepEqual(['SATURDAY 1 JULY 2023'], Array.from(dates))

        filters.date = ['invalid']

        const { total } = filterFixtures(fixtures, filters)

        assert.equal(total, 0)
    })

    it('Should filter by date & time', (): void => {
        const filters: Filters = {
            date: ['SATURDAY 1 JULY 2023'],
            time: ['10:00'],
            pitch: [],
            stage: [],
            team: [],
            ref: [],
            global: [],
        }

        const { result } = filterFixtures(fixtures, filters)

        const dates = new Set()
        const times = new Set()

        extraFixtureProps(
            (fix: Fixture) => {
                dates.add(fix.date)
                times.add(fix.time)
            },
            result
        )

        assert.deepEqual(['SATURDAY 1 JULY 2023'], Array.from(dates))
        assert.deepEqual(['10:00'], Array.from(times))

        filters.time = ['invalid']

        const { total } = filterFixtures(fixtures, filters)

        assert.equal(total, 0)
    })

    it('Should filter by date, time & pitch', (): void => {
        const filters: Filters = {
            date: ['SATURDAY 1 JULY 2023'],
            time: ['10:00'],
            pitch: ['PITCH 1'],
            stage: [],
            team: [],
            ref: [],
            global: [],
        }

        const { result } = filterFixtures(
            fixtures,
            filters
        )

        const dates = new Set()
        const times = new Set()
        const pitches = new Set()

        extraFixtureProps(
            (fix: Fixture) => {
                dates.add(fix.date)
                times.add(fix.time)
                pitches.add(fix.pitch)
            },
            result
        )

        assert.deepEqual(['SATURDAY 1 JULY 2023'], Array.from(dates))
        assert.deepEqual(['10:00'], Array.from(times))
        assert.deepEqual(['PITCH 1'], Array.from(pitches))

        filters.pitch = ['invalid']

        const { total } = filterFixtures(
            fixtures,
            filters
        )

        assert.equal(total, 0)
    })

    it('Should filter by date, time, pitch & stage', (): void => {
        const filters: Filters = {
            date: ['SATURDAY 1 JULY 2023'],
            time: ['10:00'],
            pitch: ['PITCH 1'],
            stage: ['XO D1 - POOL A'],
            team: [],
            ref: [],
            global: [],
        }

        const { result } = filterFixtures(
            fixtures,
            filters
        )

        const dates = new Set()
        const times = new Set()
        const pitches = new Set()
        const stages = new Set()

        extraFixtureProps(
            (fix: Fixture) => {
                dates.add(fix.date)
                times.add(fix.time)
                pitches.add(fix.pitch)
                stages.add(fix.stage)
            },
            result
        )

        assert.deepEqual(['SATURDAY 1 JULY 2023'], Array.from(dates))
        assert.deepEqual(['10:00'], Array.from(times))
        assert.deepEqual(['PITCH 1'], Array.from(pitches))
        assert.deepEqual(['XO D1 - POOL A'], Array.from(stages))

        filters.stage = ['invalid']

        const { total } = filterFixtures(
            fixtures,
            filters
        )

        assert.equal(total, 0)
    })

    it('Should filter by date, time, pitch, stage & team', (): void => {
        const filters: Filters = {
            date: ['SATURDAY 1 JULY 2023'],
            time: ['10:00'],
            pitch: ['PITCH 1'],
            stage: ['XO D1 - POOL A'],
            team: ['NQ Rebels', '(XO) North West Touch'],
            ref: [],
            global: [],
        }

        const { result } = filterFixtures(
            fixtures,
            filters
        )

        const dates = new Set()
        const times = new Set()
        const pitches = new Set()
        const stages = new Set()
        const teams = new Set()

        extraFixtureProps(
            (fix: Fixture) => {
                dates.add(fix.date)
                times.add(fix.time)
                pitches.add(fix.pitch)
                stages.add(fix.stage)
                teams.add(fix.homeTeam)
                    .add(fix.awayTeam)
            },
            result
        )

        assert.deepEqual(['SATURDAY 1 JULY 2023'], Array.from(dates))
        assert.deepEqual(['10:00'], Array.from(times))
        assert.deepEqual(['PITCH 1'], Array.from(pitches))
        assert.deepEqual(['XO D1 - POOL A'], Array.from(stages))
        assert.deepEqual(['NQ Rebels', 'Manchester Foxes 1'], Array.from(teams))

        filters.team = ['invalid']

        const { total } = filterFixtures(
            fixtures,
            filters
        )

        assert.equal(total, 0)
    })
})