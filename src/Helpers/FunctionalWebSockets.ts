import * as str from 'fp-ts/string'
import * as f from 'fp-ts/function'
import * as m from 'monocle-ts'
import * as utils from './FunctionalUtilities'
import { Coordinates, Player } from '../gameRules'

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
export const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => (socket: WebSocket): WebSocket => {
    socket.send(data)
    return socket
}

/**
 * For messages to backend
 */

export interface GameMessage {
    command: string
    id: number
}

export interface MoveMessage extends GameMessage {
    player: Player
    coordinates: {x: number, y: number}[]
}

export enum RequestCommand {
    RequestId = "requestId",
    JoinGame = "joinGame",
    MakeMove = "makeMove",
}

export enum ResponseCommand {
    SetId = "respondId",
    JoinGameFailed = "errorIdNotFound",
    JoinGameSucceeded = "successIdFound",
    UpdateBoardFromMove = "updateBoardFromMove"
}

// Check if message is of given command type
export const isCommandOfType = (commandType: ResponseCommand) => (gameMessage: GameMessage) =>
str.Eq.equals(m.Lens.fromProp<GameMessage>()('command').get(gameMessage), commandType)