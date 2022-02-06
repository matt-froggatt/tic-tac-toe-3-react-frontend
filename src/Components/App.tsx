import React, {useEffect, useState} from "react";
import startState, {
    BoardState,
    Coordinates,
    createCoordinates,
    getBoardFromState, Player,
    State,
    updateState,
} from "../gameRules";
import Board from "./Board/Board";
import CurrentPlayer from "./Board/CurrentPlayer";
import WinnerModal from "./WinnerModal";
import IdModal from "./IdModal";
import * as R from "ramda";
import * as ws from "../Helpers/FunctionalWebSockets";
import * as utils from "../Helpers/FunctionalUtilities"

const URL = window.location.hostname + ":8080"

const socket = ws.create(URL)

const useBoard = (): [BoardState, Player, Player, (c: Coordinates) => void, () => void] => {
    const [state, setState] = useState<State>(startState)
    return [
        getBoardFromState(state),
        state.winner,
        state.turn,
        (coordinates: Coordinates) => setState(updateState(coordinates, state)),
        () => setState(startState)
    ]
}

const connectToWebSocket = R.pipe(
    utils.log("Attempting Connection..."),
    ws.onOpen(
        R.pipe(
            utils.log("Successfully Connected"),
            ws.send("Hi From the Client!")
        )
    ),
    ws.onMessage(
        R.pipe(
            ws.event,
            R.prop('data'),
            utils.logData
        )
    ),
    ws.onClose(
        R.pipe(
            utils.logData(ws.event, `Socket Closed Connection:`),
            ws.send("Client Closed!")
        )
    ),
    ws.onError(utils.logData(error => ["Socket Error: ", ws.event(error)]))
)

const coordinates = createCoordinates()

function App() {
    const [id,] = useState<number>()
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
                setGameStarted(true)
            }} gameStarted={gameStarted}/>
            <WinnerModal winner={winner} onPlayAgain={playAgain}/>
        </div>
    );
}

export default App;
