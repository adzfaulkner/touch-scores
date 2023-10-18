import type { SheetConfig } from '@/types'

const sheetConfigs: SheetConfig[] = [
    {
        sheetId: '1sBY-UbKEU30TD4WZJE_-HLjYr6g0WcIoI7miGEITyMc',
        date: '2023-10-07T00:00:00+00:00',
        ranges: {
            schedule: 'Schedule!A10:P',
            standings: [
                'Pool One Standings!B11:S13',
                'Pool Two Standings!B11:S13',
                'Cup Standings!B11:S13',
                'Plate Standings!B11:S13',
            ],
            slotInfo: 'Schedule!B8:P8',
            refAllocations: null
        },
        competition: 'seds'
    }
]

export {
    sheetConfigs
}