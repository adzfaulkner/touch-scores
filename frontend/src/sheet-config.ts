import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '1IZfL0n5vW4ORSgOWQpSl_0L5dFIPYXZ5lfK_xq07S7w',
    schedule: [
      {
        date: '2024-06-22T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A14:R69',
          fixturePitches: 'Schedule!A13:R13',
          slotInfo: "Schedule!B12:Y12",
          playOffSlotInfo: null,
          refAllocations: "Ref Allocations!A2:Q58",
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
    label: 'MX NTS Div 1/2 R2',
  },
  {
    sheetId: '1_xz5Ws_meKpbxqcIowdPJ3W7Fa0fnOv1GkyKMVzlz1Y',
    schedule: [
      {
        date: '2024-06-23T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A14:X69',
          fixturePitches: 'Schedule!A13:X13',
          slotInfo: "Schedule!B12:AE12",
          playOffSlotInfo: null,
          refAllocations: "Ref Allocations!A2:W58",
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
    label: 'MX NTS Div 3/4 R2',
  },
  {
    sheetId: '1ss3ZuIZ7dGYBDV74WYnbLrYVYhPSxfOFbfH3ZBtXeng',
    schedule: [
      {
        date: '2024-07-15T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B9:BS32',
          fixturePitches: 'Schedule!B8:BR8',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-16T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B37:BR84',
          fixturePitches: 'Schedule!B36:BR36',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-17T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B89:BR136',
          fixturePitches: 'Schedule!B88:BR88',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-18T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B141:BR188',
          fixturePitches: 'Schedule!B140:BR140',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-19T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B193:BR244',
          fixturePitches: 'Schedule!B192:BR192',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-20T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B249:BR300',
          fixturePitches: 'Schedule!B248:BR248',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
      {
        date: '2024-07-21T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!B305:BR344',
          fixturePitches: 'Schedule!B304:BR304',
          slotInfo: null,
          playOffSlotInfo: null,
          refAllocations: null,
        },
      },
    ],
    standingRanges: [
      {
        label: 'Mens Open Pool A',
        range: 'MO Pools!B25:AQ43',
      },
      {
        label: 'Mens Open Pool B',
        range: 'MO Pools!BA25:CT45',
      },
      {
        label: 'Womens Open Pool A',
        range: 'WO Pools!B27:AY47',
      },
      {
        label: 'Womens Open Pool B',
        range: 'WO Pools!BI27:DF49',
      },
      {
        label: 'Mixed Open Pool A',
        range: 'XO Pools!B21:AM35',
      },
      {
        label: 'Mixed Open Pool B',
        range: 'XO Pools!AW21:CH35',
      },
      {
        label: 'Mixed Open Pool C',
        range: 'XO Pools!B58:AM72',
      },
      {
        label: 'Mixed Open Pool D',
        range: 'XO Pools!AW58:CH74',
      },
      {
        label: 'Mixed Open Pool D',
        range: 'XO Pools!AW58:CH74',
      },
      {
        label: 'Mixed Open play-off Pool A',
        range: 'XO PO Pools!B15:AA23',
      },
      {
        label: 'Mixed Open play-off Pool B',
        range: 'XO PO Pools!AK15:BJ23',
      },
      {
        label: 'Mixed Open play-off Pool C',
        range: 'XO PO Pools!B40:AA50',
      },
      {
        label: 'Womens 27s Round Robin',
        range: 'W27 RRobin!B25:AU45',
      },
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
