import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1-tWu4JtkZLRxkR6I8bpAKAjc4tREqSV3nfGfxzQlE28',
    date: '2024-04-13T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A16:X93',
      standings: [
        'Pool A!B13:W20',
        'Pool B!B13:W20',
        'Pool C!B17:AE28',
        'Pool D!B13:W20',
        'Pool E!B13:W20',
        'Pool F!B13:W20',
        'Pool G!B13:W20',
      ],
      slotInfo: 'Schedule!B15:AE15',
      playOffSlotInfo: null,
      refAllocations: 'Ref Allocations!A2:Q38',
    },
    competition: 'mw_nts_12',
  },
  {
    sheetId: '1u61dHirCp0cLAhFhswJ5Sghh_97ii8rrhzFz_c8YYfc',
    date: '2024-04-14T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A14:R74',
      standings: [
        'Pool A!B15:AA24',
        'Pool B!B15:AA24',
        'Pool C!B15:AA24',
        'Pool D!B15:AA24',
        'Pool E!B13:W20',
        'Pool F!B13:W20',
        'M Shield Pool 1!B11:S16',
        'M Shield Pool 2!B11:S16',
      ],
      slotInfo: 'Schedule!B13:AE13',
      playOffSlotInfo: null,
      refAllocations: 'Ref Allocations!A2:Q62',
    },
    competition: 'mw_nts_34'
  },
]

const sheetConfigMap = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
