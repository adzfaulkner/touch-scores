const reg: Map<string, WebSocket>  = new Map()

type OnOpen = (this: WebSocket, ev: Event) => any
type OnMessage = (this: WebSocket, ev: MessageEvent) => any

const waitForConnection = function (ws: WebSocket, callback: Function, interval: number) {
    if (ws.readyState === 1) {
        callback()
    } else {
        // optional: implement backoff for interval here
        setTimeout(function () {
            waitForConnection(ws, callback, interval)
        }, interval)
    }
}

const sendWS = ((waitForConnection: Function) => (ws: WebSocket, message: any) => {
    waitForConnection(ws, () => ws.send(message), 1000)
})(waitForConnection)

const connect = (url: string, onOpen: OnOpen, onMessage: OnMessage): WebSocket => {
    const ws = new WebSocket(url)

    reg.set(url, ws)

    ws.onopen = onOpen
    ws.onmessage = onMessage

    ws.onclose = (e: CloseEvent) => {
        setTimeout(() => connect(url, onOpen, onMessage), 1000)
    }

    ws.onerror = (e: Event) => {
        ws.close()
    }

    return ws
}

const getWS = (url: string, onOpen: OnOpen, onMessage: OnMessage): WebSocket => {
    return reg.get(url) || connect(url, onOpen, onMessage)
}

export {
    getWS,
    sendWS,
}