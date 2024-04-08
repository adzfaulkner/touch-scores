import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1u61dHirCp0cLAhFhswJ5Sghh_97ii8rrhzFz_c8YYfc',
    date: '2024-04-14T00:00:00+00:00',
    ranges: {
      schedule: 'A14:R74',
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
      slotInfo: 'B13:AE13',
      playOffSlotInfo: null,
      refAllocations: 'Ref Allocations!A2:Q62',
    },
    competition: 'mw_nts'
  }
]

const sheetConfigMap = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
