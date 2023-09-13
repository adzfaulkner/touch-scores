import type { Fixture } from '../../../src/types'

import { describe, it, assert } from 'vitest'
import { DateTime } from 'luxon'

import { byTapoffTimeAndPitch } from '../../../src/support/fixtures'
import { nts_schedule, nts_refAllocs } from '../fixtures'

const readFromCell: number = 13
const dateIso: string = '2023-07-01T00:00:00+00:00'

describe('Aggregates raw data', () => {
    it('Should aggregate the raw data as expected', (): void => {
        const dates = new Set<string>()
        const times = new Set<string>()
        const pitches = new Set<string>()
        const fixtures: Fixture[] = []
        const teams  = new Set<string>()
        const stages = new Set<string>()
        const refs = new Set<string>()
        const comps = new Set<string>()

        const it = byTapoffTimeAndPitch(
            nts_schedule,
            nts_refAllocs,
            readFromCell,
            'nts',
            DateTime.fromISO(dateIso).toFormat('cccc d MMMM y').toUpperCase()
        )

        it(dates, times, pitches, fixtures, teams, stages, refs, comps)

        assert.deepEqual(Array.from(dates), ['SATURDAY 1 JULY 2023'])
        assert.deepEqual(Array.from(times), [
            '10:00', '10:30', '11:00', '11:30', '12:00',
            '12:30', '13:00', '13:30', '14:05', '14:40',
            '15:15', '15:50', '16:25', '17:00'
        ])
        assert.deepEqual(Array.from(pitches),[
            'PITCH 1', 'PITCH 2', 'PITCH 3',
            'PITCH 4', 'PITCH 5', 'PITCH 6'
        ])
        assert.deepEqual(Array.from(teams), [
            'NQ Rebels', 'Manchester Foxes 1', 'Cambridge 1 - Hornets', 'Chester Cheetahs 1',
            'Exeter Eagle Owls 1', 'Blaze', 'Cheltenham Tigers', 'Norwich Rebels',
            'London Scorpions', 'Oxford Touch 1', 'London Eagles 1', 'Nottingham 2 - Mavericks',
            'Nottingham 1 - Hoods', 'Bristol Jets', 'Raptors Touch', 'London Eagles 2',
            'Wigan Warriors 1', 'Hot Custard', 'Galaxy Touch London 1', 'Revolution Touch 1',
            'Cambridge 2 - Bees', 'Galaxy Touch London 2', 'London Vipers', 'Oxford Touch 2'
        ])
        assert.lengthOf(fixtures, 72)
        assert.deepEqual(Array.from(stages), [
            'XO D1 - POOL A', 'XO D2 - POOL F', 'XO D1 - POOL B', 'XO D1 - POOL C', 'XO D1 - POOL D', 'XO D2 - POOL E',
            'XO D1 - CUP QF1', 'XO D1 - CUP QF2', 'XO D1 - BOWL QF1', 'XO D1 - BOWL QF2', 'XO D1 - BOWL QF3',
            'XO D1 - BOWL QF4', 'XO D1 - CUP QF3', 'XO D1 - CUP QF4', 'XO D2 - CUP QF1', 'XO D2 - CUP QF2',
            'XO D2 - CUP QF3', 'XO D2 - CUP QF4', 'XO D1 - CUP SF1', 'XO D1 - PLATE SF1', 'XO D1 - BOWL SF1',
            'XO D1 - BOWL SF2', 'XO D1 - SHIELD SF1', 'XO D1 - SHIELD SF2', 'XO D1 - CUP SF2', 'XO D1 - PLATE SF2',
            'XO D2 - CUP SF1', 'XO D2 - CUP SF2', 'XO D2 - PLATE SF1', 'XO D2 - PLATE SF2', 'XO D1 - BOWL FINAL',
            'XO D1 - BOWL PLAY-OFF', 'XO D1 - SHIELD FINAL', 'XO D1 - SHIELD PLAY-OFF', 'XO D2 - CUP FINAL',
            'XO D2 - CUP PLAY-OFF', 'XO D1 - PLATE FINAL', 'XO D1 - PLATE PLAY-OFF', 'XO D2 - PLATE FINAL',
            'XO D2 - PLATE PLAY-OFF', 'XO D1 - CUP FINAL', 'XO D1 - CUP PLAY-OFF'
        ])
        assert.lengthOf(Array.from(refs), 36)
        assert.deepEqual(Array.from(comps), ['nts'])
    })
})
