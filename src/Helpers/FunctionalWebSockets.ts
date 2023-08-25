// Creates and returns a new websocket from the given URL
export const create = (URL: any): WebSocket => new WebSocket(`ws://${URL}/ws`)

// Returns a function which sets onclose for a socket to the given function with socket provided to that function
export const onClose = (fn: ([socket, event]: [WebSocket, CloseEvent]) => any) => (socket: WebSocket): WebSocket => {
    socket.onclose = (e) => fn([socket, e])
    return socket
}

// Returns a function which sets onerror for a socket to the given function with socket provided to that function
export const onError = (fn: ([socket, event]: [WebSocket, Event]) => any) => (socket: WebSocket): WebSocket => {
    socket.onerror = (e) => fn([socket, e])
    return socket
}

// Returns a function which sets onmessage for a socket to the given function with socket provided to that function
export const onMessage = (fn: ([socket, event]: [WebSocket, MessageEvent]) => any) => (socket: WebSocket): WebSocket => {
    socket.onmessage = (e) => fn([socket, e])
    return socket
}

// Returns a function which sets onopen for a socket to the given function with socket provided to that function
export const onOpen = (fn: ([socket, event]: [WebSocket, Event]) => any) => (socket: WebSocket): WebSocket => {
    socket.onopen = (e) => fn([socket, e])
    return socket
}

// Returns a function which sends the given data through a websocket
export const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => <T>([socket, event]: [WebSocket, T]): [WebSocket, T] => {
    socket.send(data)
    return [socket, event]
}

// Get the current event for use in logging functions inside of event handlers
export const event = <T>([, event]: [WebSocket, T]) => event
