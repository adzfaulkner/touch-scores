import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1qRWyJx0R50PDtM6opQCd5mflergsXhzxo4aTotGeepM',
    schedule: [
      {
        date: '2024-05-04T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A17:X57',
          fixturePitches: 'Schedule!A17:X17',
          slotInfo: 'Schedule!B16:Y16',
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-05-05T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A62:X101',
          fixturePitches: 'Schedule!A17:X17',
          slotInfo: 'Schedule!B58:Y58',
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-05-06T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A106:X141',
          fixturePitches: 'Schedule!A17:X17',
          slotInfo: 'Schedule!B102:Y102',
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
    ],
    standingRanges: [
      'Mens Open!B16:AE28',
      'Womens Open!B16:AE28',
      'Mixed Open!B18:AI32',
      'Womens 27s!B12:W20',
      'Mens 30s!B16:AE28',
      'Womens 35s!B8:AE12',
      'Womens 40s!B12:W20',
      'Mens 40s!B10:AE16',
      'Mens 45s!B10:AE16',
      'Mens 50s!B10:AE16',
    ],
    competition: 'nationals',
    label: 'Nationals',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
