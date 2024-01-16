import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1-QZFrjHCBu9qBbkAc2CBNvTWMKISiIcEM_1HCNewnQk',
    date: '2024-01-20T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A14:Q',
      standings: [
        'Standings - Pool One!A10:U12',
        'Standings - Pool Two!A10:U12',
        'Standings - Pool Three!A10:U12',
        'Standings - Pool Four!A10:U12',
      ],
      slotInfo: 'Schedule!C13:R13',
      refAllocations: null
    },
    competition: 'seds'
  }
]

const sheetConfigMap = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
