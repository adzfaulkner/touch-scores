import type { Filters } from '../../src/types'

import { describe, it, assert } from 'vitest'
import {DateTime} from 'luxon'
import { aggregateRawData, filterFixtures, byTapoffTimeAndPitch } from '../../src/support/fixtures'
import { nts_schedule, nts_refAllocs } from './fixtures'

const dateIso: string = '2023-07-01T00:00:00+00:00'
const readFromCell: number = 13

const aggregator = byTapoffTimeAndPitch(
    nts_schedule,
    nts_refAllocs,
    readFromCell,
    'nts',
    DateTime.fromISO(dateIso).toFormat('cccc d MMMM y').toUpperCase()
)

const { fixtures } = aggregateRawData(aggregator)

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

        const res = filterFixtures(fixtures, filters)

        assert.deepEqual(fixtures, res)
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

        let res = filterFixtures(fixtures, filters)

        const dates = Array.from(new Set(res.map((fix) => fix.date)).values())

        assert.deepEqual(['SATURDAY 1 JULY 2023'], dates)

        filters.date = ['invalid']

        res = filterFixtures(fixtures, filters)

        assert.lengthOf(res, 0)
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

        let res = filterFixtures(fixtures, filters)

        const dates = Array.from(new Set(res.map((fix) => fix.date)).values())
        const times = Array.from(new Set(res.map((fix) => fix.time)).values())

        assert.deepEqual(['SATURDAY 1 JULY 2023'], dates)
        assert.deepEqual(['10:00'], times)

        filters.time = ['invalid']

        res = filterFixtures(fixtures, filters)

        assert.lengthOf(res, 0)
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

        let res = filterFixtures(
            fixtures,
            filters
        )

        const dates = Array.from(new Set(res.map((fix) => fix.date)).values())
        const times = Array.from(new Set(res.map((fix) => fix.time)).values())
        const pitches = Array.from(new Set(res.map((fix) => fix.pitch)).values())

        assert.deepEqual(['SATURDAY 1 JULY 2023'], dates)
        assert.deepEqual(['10:00'], times)
        assert.deepEqual(['PITCH 1'], pitches)

        filters.pitch = ['invalid']

        res = filterFixtures(
            fixtures,
            filters
        )

        assert.lengthOf(res, 0)
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

        let res = filterFixtures(
            fixtures,
            filters
        )

        const dates = Array.from(new Set(res.map((fix) => fix.date)).values())
        const times = Array.from(new Set(res.map((fix) => fix.time)).values())
        const pitches = Array.from(new Set(res.map((fix) => fix.pitch)).values())
        const stages = Array.from(new Set(res.map((fix) => fix.stage)).values())

        assert.deepEqual(['SATURDAY 1 JULY 2023'], dates)
        assert.deepEqual(['10:00'], times)
        assert.deepEqual(['PITCH 1'], pitches)
        assert.deepEqual(['XO D1 - POOL A'], stages)

        filters.stage = ['invalid']

        res = filterFixtures(
            fixtures,
            filters
        )

        assert.lengthOf(res, 0)
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

        let res = filterFixtures(
            fixtures,
            filters
        )

        const dates = Array.from(new Set(res.map((fix) => fix.date)).values())
        const times = Array.from(new Set(res.map((fix) => fix.time)).values())
        const pitches = Array.from(new Set(res.map((fix) => fix.pitch)).values())
        const stages = Array.from(new Set(res.map((fix) => fix.stage)).values())
        const teams = Array.from(new Set([...res.map((fix) => fix.homeTeam), ...res.map((fix) => fix.awayTeam)]).values())

        assert.deepEqual(['SATURDAY 1 JULY 2023'], dates)
        assert.deepEqual(['10:00'], times)
        assert.deepEqual(['PITCH 1'], pitches)
        assert.deepEqual(['XO D1 - POOL A'], stages)
        assert.deepEqual(['NQ Rebels', 'Manchester Foxes 1'], teams)

        filters.team = ['invalid']

        res = filterFixtures(
            fixtures,
            filters
        )

        assert.lengthOf(res, 0)
    })
})