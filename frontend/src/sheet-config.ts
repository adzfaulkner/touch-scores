import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1qiJrETpYfEES9TUkfVtu4L9yTrRyaUHRYCcb_SnRnX4',
    date: '2023-12-18T00:00:00+00:00',
    ranges: {
      schedule: 'Schedule!A10:Q',
      standings: [
        'Standings!A12:U15'
      ],
      slotInfo: 'Schedule!C9:R9',
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
