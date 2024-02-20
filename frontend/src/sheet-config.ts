import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1Zwl3XQ4h9ZE3UZMLOLWWZjXboZTgmJCxSWiLfLw464g',
    date: '2024-02-24T00:00:00+00:00',
    ranges: {
      schedule: 'A11:AX',
      standings: [
        'Standings - Cup/Plate Pool 1!A12:U15',
        'Standings - Cup/Plate Pool 2!A12:U15',
        'Standings - Bowl!A16:U21',
      ],
      slotInfo: 'C11:AX11',
      playOffSlotInfo: 'C43:AW43',
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
