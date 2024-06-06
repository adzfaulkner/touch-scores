import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1-lWfwc1zCx1NIDNCGwBx-g_iVg8sJX925v9i2hNvyRQ',
    schedule: [
      {
        date: '2024-06-08T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A14:R69',
          fixturePitches: 'Schedule!13:13',
          slotInfo: 'Schedule!B12:Y12',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!A2:Q58',
        },
      },
    ],
    standingRanges: [
      'Pool A!B12:W20',
      'Pool B!B12:W20',
      'Pool C!B12:W20',
      'Pool D!B12:W20',
      'Pool E!B12:W20',
      'Pool F!B12:W20',
    ],
    competition: 'mixed_nts',
    label: 'MX NTS Div 1/2 R1',
  },
  {
    sheetId: '1nq8BHB7vd9ttqJXZFHExYZD91qotWbxcBgdzYCKdK6Q',
    schedule: [
      {
        date: '2024-06-09T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!14:68',
          fixturePitches: 'Schedule!13:13',
          slotInfo: 'Schedule!B12:AE12',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!A2:W58',
        },
      },
    ],
    standingRanges: [
      'Pool A!B12:W20',
      'Pool B!B12:W20',
      'Pool C!B12:W20',
      'Pool D!B12:W20',
      'Pool E!B12:W20',
      'Pool F!B12:W20',
      'Pool G!B12:W20',
      'Pool H!B12:W20',
    ],
    competition: 'mixed_nts',
    label: 'MX NTS Div 3/4 R1',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
