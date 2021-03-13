import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, State, updateState,} from "../gameRules";
import Board from "./Board";
import CurrentPlayer from "./CurrentPlayer";
import WinnerModal from "./WinnerModal";
import IdModal from "./IdModal";

// const URL = window.location.hostname + ":5000"

interface AppState {
    id: number
    gameStarted: boolean
    boardState: State
}

function App() {
    const [gameState, setGameState] = useState<AppState>({id: 1234, gameStarted: false, boardState: startState});
    const boardFromState = getBoardFromState(gameState.boardState)
    const coordinates = createCoordinates()
    const stateUpdate = (coordinates: any) =>
        setGameState({ ...gameState, boardState: updateState(coordinates, gameState.boardState) })

    const playAgain = () => setGameState({...gameState, boardState: startState})

    useEffect(() => {
        // console.log("wowee")
        // const websocket = new WebSocket("ws://" + URL + "/ws")
        // websocket.onopen = () => websocket.send("id")
        // websocket.onmessage = msg => setState({ id: msg.data, boardState: gameState.boardState })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <IdModal id={gameState.id} onIdSubmit={() => {setGameState({...gameState, gameStarted: true})}} gameStarted={gameState.gameStarted} />
            <WinnerModal winner={gameState.boardState.winner} onPlayAgain={playAgain}/>
            <Board
                state={boardFromState}
                coordinates={coordinates}
                updateState={stateUpdate}
            />
            <CurrentPlayer currentPlayer={gameState.boardState.turn}/>
        </div>
    );
}

export default App;
