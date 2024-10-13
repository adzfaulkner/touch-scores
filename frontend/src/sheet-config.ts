import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1Y0ckxL8HvbFncwF1zpYLq_CMbshyUXTNCyU2IZnILwk',
    schedule: [
      {
        date: '2024-10-19T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A7:F50',
          fixturePitches: 'Schedule!6:6',
          slotInfo: 'Schedule!B5:F5',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!2:58',
        },
      },
    ],
    standingRanges: [
      {
        label: 'Pool Table',
        range: 'Standings!A2:J9',
      },
    ],
    competition: 'seds',
    label: 'SEDS 24/25 R1',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
