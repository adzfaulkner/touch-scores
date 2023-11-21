const initConnection = (url: string): WebSocket => {
    return new WebSocket(url)
}

const connect = (url: string, persist: boolean = true): WebSocket => {
    let ws = initConnection(url)

    const reconnect = ((ws: WebSocket, persist: boolean, url: string) => () => {
        if (persist) {
            setTimeout(() => ws = initConnection(url), 1000)
        }
    })(ws, persist, url)

    ws.onopen =  (e: Event) => {
        console.log('Socket open.', e)
    }

    ws.onclose = ((reconnect: Function) => (e: CloseEvent) => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e)
        reconnect()
    })(reconnect)

    ws.onerror = ((reconnect: Function) => (e: Event) => {
        console.log('Socket has errord. Reconnect will be attempted in 1 second.', e)
        reconnect()
    })(reconnect)

    return ws
}

export {
    connect
}