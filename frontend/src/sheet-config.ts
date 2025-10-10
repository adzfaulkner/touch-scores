import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1c6MJB1CMttmo02vW1q1JZ3kCPoYv09H0WeLnUgEhs9U',
    schedule: [
      {
        date: '2025-02-08T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A7:F65',
          fixturePitches: 'Schedule!6:6',
          slotInfo: 'Schedule!B5:F5',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!2:62',
        },
      },
    ],
    standingRanges: [
      {
        label: 'Pool Table',
        range: 'Standings!A2:J14',
      },
    ],
    competition: 'seds',
    label: 'SEDS 24/25 R3',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
