import type {Filters, Fixture} from '../../src/types'

import { describe, it, assert } from 'vitest'
import { filterFixtures } from '../../src/support/fixtures'

interface arg {
    homeTeam: string,
    awayTeam: string,
    time: string,
    stage: string,
    pitch: string,
    ref1: string,
    ref2: string,
    ref3: string,
    videoUrl: string
}

const arg: arg = {
    homeTeam: 'A',
    awayTeam: 'B',
    time: '9:00',
    stage: 'Pool One',
    pitch: 'Pitch 1',
    ref1: 'Ref 1',
    ref2: 'Ref2 ',
    ref3: 'Ref 3',
    videoUrl: '',
}

const defaultFixture: Fixture = {
    homeTeam: 'A',
    homeTeamScore: '',
    homeTeamScoreRange: 'A1',
    awayTeam: 'B',
    awayTeamScore: '',
    awayTeamScoreRange: 'A2',
    time: '9:00',
    stage: 'Pool One',
    pitch: 'Pitch 1',
    ref1: 'Ref 1',
    ref1Range: 'B1',
    ref2: 'Ref2 ',
    ref2Range: 'B2',
    ref3: 'Ref 3',
    ref3Range: 'B3',
    videoUrl: ''
}

const produceFixture = (arg: arg): Fixture => {
    return {
        ...defaultFixture,
        ...arg,
    }
}

describe('filters fixtures', () => {
    it('Should return all fixtures if no filters defined',
        (): void => {
            const filters: Filters = {
                date: [],
                time: [],
                pitch: [],
                stage: [],
                team: [],
                ref: [],
                global: [],
                stream: []
            }

            const fixtures: Fixture[] = [
                { ...produceFixture({ ...arg }) },
            ];

            const result = filterFixtures(fixtures, filters)

            assert.deepEqual(fixtures, result)
        }
    )

    it('Should filter by time',
        (): void => {
            const filters: Filters = {
                date: [],
                time: ['9:00'],
                pitch: [],
                stage: [],
                team: [],
                ref: [],
                global: [],
                stream: [],
            }

            const fixtures: Fixture[] = [
                { ...produceFixture({ ...arg, time: '9:00' }) },
                { ...produceFixture({ ...arg, time: '9:30' }) },
            ];

            const result = filterFixtures(fixtures, filters)

            assert.deepEqual([fixtures[0]], result)
        }
    )

    it('Should filter by time & pitch',
        (): void => {
            const filters: Filters = {
                date: [],
                time: ['9:00'],
                pitch: ['Pitch 2'],
                stage: [],
                team: [],
                ref: [],
                global: [],
                stream: [],
            }

            const fixtures: Fixture[] = [
                { ...produceFixture({ ...arg, time: '9:00', pitch: 'Pitch 1' }) },
                { ...produceFixture({ ...arg, time: '9:00', pitch: 'Pitch 2' }) },
            ];

            const result = filterFixtures(fixtures, filters)

            assert.deepEqual([fixtures[1]], result)
        }
    )

    it('Should filter by team & ref',
        (): void => {
            const filters: Filters = {
                date: [],
                time: [],
                pitch: [],
                stage: [],
                team: ["A"],
                ref: ["Ref 2"],
                global: [],
                stream: []
            }

            const fixtures: Fixture[] = [
                { ...produceFixture({ ...arg, homeTeam: 'A', awayTeam: 'B', ref1: 'Ref 1' }) },
                { ...produceFixture({ ...arg, homeTeam: 'C', awayTeam: 'D', ref1: 'Ref 2' }) },
                { ...produceFixture({ ...arg, homeTeam: 'A', awayTeam: 'C', ref1: 'Ref 2' }) },
                { ...produceFixture({ ...arg, homeTeam: 'B', awayTeam: 'D', ref1: 'Ref 1' }) },
                { ...produceFixture({ ...arg, homeTeam: 'A', awayTeam: 'D', ref1: 'Ref 2' }) },
                { ...produceFixture({ ...arg, homeTeam: 'B', awayTeam: 'C', ref1: 'Ref 1' }) },
            ];

            const result = filterFixtures(fixtures, filters)

            assert.deepEqual([fixtures[2], fixtures[4]], result)
        }
    )

    it('Should filter by video url',
        (): void => {
            const filters: Filters = {
                date: [],
                time: [],
                pitch: [],
                stage: [],
                team: [],
                ref: [],
                global: [],
                stream: ['true']
            }

            const fixtures: Fixture[] = [
                { ...produceFixture({ ...arg, homeTeam: 'A', awayTeam: 'B', videoUrl: '' }) },
                { ...produceFixture({ ...arg, homeTeam: 'C', awayTeam: 'D', videoUrl: 'http://exampple'}) },
            ];

            const result = filterFixtures(fixtures, filters)

            assert.deepEqual([fixtures[1]], result)
        }
    )
})