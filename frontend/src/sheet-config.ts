import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '18DJh_p93Trq2VBzQlqB3cAYVP1NC50N9RwEYcoYF-jA',
    schedule: [
      {
        date: '2024-11-23T00:00:00+00:00',
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
    label: 'SEDS 24/25 R2',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
