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
import * as ws from "../Helpers/FunctionalWebSockets";
import * as utils from "../Helpers/FunctionalUtilities"
import * as Opt from 'fp-ts/lib/Option'
import * as m from 'monocle-ts'

const URL = window.location.hostname + ":8080"

const socket = ws.create(URL)

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

const connectToWebSocket: (ws: WebSocket) => WebSocket = f.flow(
    utils.log("Attempting Connection..."),
    ws.onOpen(
        f.flow(
            utils.log("Successfully Connected"),
            ws.send("Hi From the Client!")
        )
    ),
    ws.onMessage(
        f.flow(
            ws.event,
            m.Lens.fromProp<MessageEvent>()('data').get,
            utils.logAndTransformData((data: any) => data) // This is just an example, modify the transform function as needed
        )
    ),
    ws.onClose(
        f.flow(
            utils.logAndTransformData(([, event]: [WebSocket, CloseEvent]) => `Socket Closed Connection: ${event}`),
            ws.send("Client Closed!")
        )
    ),
    ws.onError((error: any) => utils.logAndTransformData(() => `Socket Error: ${error}`))
)

const coordinates = createCoordinates()

function App() {
    const [id, setId] = useState<Opt.Option<number>>(Opt.none)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [board, winner, turn, playAtCoordinates, playAgain] = useBoard()

    useEffect(() => {
        connectToWebSocket(socket)
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