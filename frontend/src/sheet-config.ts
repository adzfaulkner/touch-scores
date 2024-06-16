import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1ss3ZuIZ7dGYBDV74WYnbLrYVYhPSxfOFbfH3ZBtXeng',
    schedule: [
      {
        date: '2024-07-15T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B9:BS32',
          fixturePitches: 'Schedule!C8:BR8',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
    ],
    standingRanges: [
      'MO Pools!B25:AQ43',
    ],
    competition: 'wc_24',
    label: 'FIT World Cup 24',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
