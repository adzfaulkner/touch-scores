import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
  {
    sheetId: '14osmgWjrMOo_5ptZYf-jYXb_DTA2rRjitFFIqY4_D5s',
    schedule: [
      {
        date: '2024-08-24T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A14:R69',
          fixturePitches: 'Schedule!13:13',
          slotInfo: 'Schedule!B12:Y12',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!2:58',
        },
      },
    ],
    standingRanges: [
      {
        label: 'Div 1 Pool A',
        range: 'Pool A!B12:W20',
      },
      {
        label: 'Div 1 Pool B',
        range: 'Pool B!B12:W20',
      },
      {
        label: 'Div 1 Pool C',
        range: 'Pool C!B12:W20',
      },
      {
        label: 'Div 1 Pool D',
        range: 'Pool D!B12:W20',
      },
      {
        label: 'Div 2 Pool E',
        range: 'Pool E!B12:W20',
      },
      {
        label: 'Div 2 Pool F',
        range: 'Pool F!B12:W20',
      },
    ],
    competition: 'mixed_nts',
    label: 'Mixed NTS 2024 Div 1/2 R3',
  },
  {
    sheetId: '1Lyh7DhGXqnUXSGJnOcOSrEndukKpdWLFZTkaBqcIsF8',
    schedule: [
      {
        date: '2024-08-25T00:00:00+00:00',
        ranges: {
          fixtures: 'Schedule!A14:R73',
          fixturePitches: 'Schedule!A13:R13',
          slotInfo: 'Schedule!B12:AE12',
          playOffSlotInfo: null,
          refAllocations: 'Ref Allocations!A2:Q62',
        },
      },
    ],
    standingRanges: [
      {
        label: 'Div 3 Pool A',
        range: 'Pool A!B12:W20',
      },
      {
        label: 'Div 3 Pool B',
        range: 'Pool B!B12:W20',
      },
      {
        label: 'Div 3 Pool C',
        range: 'Pool C!B12:W20',
      },
      {
        label: 'Div 3 Pool D',
        range: 'Pool D!B12:W20',
      },
      {
        label: 'Div 4 Pool E',
        range: 'Pool E!B12:W20',
      },
      {
        label: 'Div 4 Pool F',
        range: 'Pool F!B12:W20',
      },
      {
        label: 'Div 4 Pool G',
        range: 'Pool G!B12:W20',
      },
    ],
    competition: 'mixed_nts',
    label: 'Mixed NTS 2024 Div 3/4 R3',
  },
]

const sheetConfigMap: Map<string, SheetConfig> = new Map()
sheetConfigs.forEach((sc: SheetConfig) => sheetConfigMap.set(sc.sheetId, sc))

export {
  sheetConfigs,
  sheetConfigMap,
}
