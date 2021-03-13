import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, State, updateState,} from "../gameRules";
import Board from "./Board";
import CurrentPlayer from "./CurrentPlayer";
import Winner from "./Winner";

// const URL = window.location.hostname + ":5000"

interface AppState {
    id: string
    boardState: State
}

function App() {
    const [gameState, setGameState] = useState<AppState>({id: "waiting...", boardState: startState});
    const boardFromState = getBoardFromState(gameState.boardState)
    const coordinates = createCoordinates()
    const stateUpdate = (coordinates: any) =>
        setGameState({
            id: gameState.id,
            boardState: updateState(coordinates, gameState.boardState)
        })

    useEffect(() => {
        // console.log("wowee")
        // const websocket = new WebSocket("ws://" + URL + "/ws")
        // websocket.onopen = () => websocket.send("id")
        // websocket.onmessage = msg => setState({ id: msg.data, boardState: gameState.boardState })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Your ID is: {gameState.id}</h1>
            <Winner winner={gameState.boardState.winner}/>
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
