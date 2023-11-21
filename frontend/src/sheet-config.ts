import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1DrMWVeR4z5OCnvzYmvBh7RQRDS-eNdD-s5iyCxq9q7I',
    date: '2023-11-25T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A10:Q',
      standings: [
        'Standings - Pool One!A12:U15',
        'Standings - Pool TWO!A12:U15'
      ],
      slotInfo: 'Schedule!C10:Q10',
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
