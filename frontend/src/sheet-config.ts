import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1-tWu4JtkZLRxkR6I8bpAKAjc4tREqSV3nfGfxzQlE28',
    schedule: [
      {
        date: '2024-05-18T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!57:91',
          fixturePitches: 'Schedule!16:16',
          slotInfo: 'Schedule!B55:X56',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!2:38',
        },
      },
    ],
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
    label: 'MW NTS Div 1/2 R2',
  },
  {
    sheetId: '1k6MKPQyFNrb51kLliNLTsKrB-2BJwOSJt296kdESLcE',
    schedule: [
      {
        date: '2024-05-19T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!15:73',
          fixturePitches: 'Schedule!14:14',
          slotInfo: 'Schedule!B13:AE13',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!2:62',
        },
      },
    ],
    standingRanges: [
      'Pool A!B14:AA24',
      'Pool B!B14:AA24',
      'Pool C!B14:AA24',
      'Pool D!B14:AA24',
      'Pool E!B14:AA24',
      'Pool F!B14:AA24',
    ],
    competition: 'mw_nts_34',
    label: 'MW NTS Div 3 R2',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
