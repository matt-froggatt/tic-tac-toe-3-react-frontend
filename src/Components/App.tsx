import React, { useEffect, useState } from "react";
import startState, {
    BoardState,
    Coordinates,
    createCoordinates,
    getBoardFromState,
    Player,
    GameState,
    updateState,
} from "../gameRules";
import Board from "./Board/Board";
import CurrentPlayer from "./Board/CurrentPlayer";
import WinnerModal from "./WinnerModal";
import IdModal from "./IdModal";
import * as f from "fp-ts/lib/function";
import * as socketfns from "../Helpers/FunctionalWebSockets";
import * as utils from "../Helpers/FunctionalUtilities"
import * as Opt from 'fp-ts/lib/Option'
import * as Eit from 'fp-ts/lib/Either'
import * as m from 'monocle-ts'
import * as F from "fp-ts-std/Function";
import * as str from "fp-ts/string"
import * as io from "io-ts"
import { json, number } from "fp-ts";

interface GameMessage {
    command: string
    id?: number
}

enum CommandType {
    SetId = "respondId"
}

const URL = window.location.hostname + ":8080"

const socket = socketfns.create(URL)

const isCommandOfType = (commandType: CommandType) => (gameMessage: GameMessage) =>
str.Eq.equals(m.Lens.fromProp<GameMessage>()('command').get(gameMessage), commandType)

const useBoard = (): [BoardState, Player, Player, (c: Coordinates) => void, () => void] => {
    const [state, setState] = useState<GameState>(startState)
    return [
        getBoardFromState(state),
        state.winner,
        state.turn,
        (coordinates: Coordinates) => setState(updateState(coordinates, state)),
        () => setState(startState)
    ]
}

const connectToWebSocket: (setId: (id: Opt.Option<number>) => void) => (ws: WebSocket) => WebSocket = (setId) => f.flow(
    utils.log("Attempting Connection..."),
    socketfns.onOpen(
        f.flow(
            utils.log("Successfully Connected"),
            socketfns.send(JSON.stringify({ "command": "requestId" })),
        )
    ),
    socketfns.onMessage(
        f.flow(
            socketfns.event,
            m.Lens.fromProp<MessageEvent>()('data').get,
            utils.logValue, // This is just an example, modify the transform function as needed
            JSON.parse,
            (r) => r as GameMessage,
            F.guard<GameMessage, any>([
                [isCommandOfType(CommandType.SetId), f.flow(m.Lens.fromProp<GameMessage>()('id').get, Opt.fromNullable, setId)],
                ])(utils.logAndTransformData((data) => "Unrecognized command: " + JSON.stringify(data)))
        )
    ),
    socketfns.onClose(
        f.flow(
            utils.logAndTransformData(([, event]: [WebSocket, CloseEvent]) => `Socket Closed Connection: ${event}`),
            socketfns.send("Client Closed!")
        )
    ),
    socketfns.onError((error: any) => utils.logAndTransformData(() => `Socket Error: ${error}`))
)

const coordinates = createCoordinates()

function App() {
    const [id, setId] = useState<Opt.Option<number>>(Opt.none)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [board, winner, turn, playAtCoordinates, playAgain] = useBoard()

    useEffect(() => {
        connectToWebSocket(setId)(socket)
    }, [])

    return (
        <div className="flex flex-row items-center justify-center w-screen h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <Board
                    state={board}
                    coordinates={coordinates}
                    updateState={playAtCoordinates}
                />
                <CurrentPlayer currentPlayer={turn}/>
            </div>
            <IdModal id={id} onIdSubmit={() => {
                setId(Opt.none)
                setGameStarted(true)
            }} gameStarted={gameStarted}/>
            <WinnerModal winner={winner} onPlayAgain={playAgain}/>
        </div>
    );
}

export default App;