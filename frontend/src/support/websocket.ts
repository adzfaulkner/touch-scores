const reg: Map<string, WebSocket>  = new Map()

type OnOpen = (this: WebSocket, ev: Event) => any
type OnMessage = (this: WebSocket, ev: MessageEvent) => any

const connect = (url: string, onOpen: OnOpen, onMessage: OnMessage): WebSocket => {
    const ws = new WebSocket(url)

    reg.set(url, ws)

    ws.onopen = onOpen
    ws.onmessage = onMessage

    ws.onclose = (e: CloseEvent) => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.')
        setTimeout(() => connect(url, onOpen, onMessage), 500)
    }

    ws.onerror = (e: Event) => {
        console.log('Socket has errord. Reconnect will be attempted in 1 second.')
        setTimeout(() => connect(url, onOpen, onMessage), 500)
    }

    return ws
}

const getWS = (url: string, onOpen: OnOpen, onMessage: OnMessage): WebSocket => {
    return reg.get(url) || connect(url, onOpen, onMessage)
}

export {
    getWS
}