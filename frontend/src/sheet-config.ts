import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1-tWu4JtkZLRxkR6I8bpAKAjc4tREqSV3nfGfxzQlE28',
    schedule: [{
      date: '2024-04-13T00:00:00+00:00',
      ranges: {
        fixtures: 'Schedule!A16:X93',
        slotInfo: 'Schedule!B15:AE15',
        playOffSlotInfo: null,
        refAllocations: 'Ref Allocations!A2:Q38',
      }
    }],
    standingRanges: [
      'Pool A!B12:W20',
      'Pool B!B12:W20',
      'Pool C!B16:AE28',
      'Pool D!B12:W20',
      'Pool E!B12:W20',
      'Pool F!B12:W20',
      'Pool G!B12:W20',
    ],
    competition: 'mw_nts_12',
  },
  {
    sheetId: '1u61dHirCp0cLAhFhswJ5Sghh_97ii8rrhzFz_c8YYfc',
    schedule: [{
      date: '2024-04-14T00:00:00+00:00',
      ranges: {
        fixtures: 'Schedule!A14:R74',
        refAllocations: 'Ref Allocations!A2:Q62',
        slotInfo: 'Schedule!B13:AE13',
        playOffSlotInfo: null,
      }
    }],
    standingRanges: [
      'Pool A!B14:AA24',
      'Pool B!B14:AA24',
      'Pool C!B14:AA24',
      'Pool D!B14:AA24',
      'Pool E!B12:W20',
      'Pool F!B12:W20',
      'M Shield Pool 1!B10:S16',
      'M Shield Pool 2!B10:S16',
    ],
    competition: 'mw_nts_34'
  },
]

const sheetConfigMap = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
