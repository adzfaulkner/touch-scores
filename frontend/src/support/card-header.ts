import type { StyleValue } from 'vue'

const latterStageCardHeaderStyles: Map<string, StyleValue> = new Map([
    ['CUP', { backgroundColor: '#fff2cc' }],
    ['PLATE', { backgroundColor: '#b7b7b7' }],
    ['BOWL', { backgroundColor: '#e6b8af' }],
])

const specificStageCardHeaderStyles: Map<string, StyleValue | undefined> = new Map([
    ['POOL A', { backgroundColor: '#d0dfe2' }],
    ['POOL B', { backgroundColor: '#d9d2e9' }],
    ['POOL C', { backgroundColor: '#d0e2f3' }],
    ['11/12TH PO', latterStageCardHeaderStyles.get('BOWL')],
    ['7/8TH PO', latterStageCardHeaderStyles.get('PLATE')],
    ['3RD/4TH PO', latterStageCardHeaderStyles.get('CUP')],
])

export const getCardHeaderStyle = (stage: string): StyleValue => {
    stage = stage.toUpperCase()

    let style = specificStageCardHeaderStyles.get(stage)
    if (style !== undefined) {
        return style
    }

    const [stagep] = stage.split(" ")
    style = latterStageCardHeaderStyles.get(stagep)
    return style !== undefined ? style : {}
}