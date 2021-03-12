import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, State, updateState,} from "../gameRules";
import Board from "./Board";
import CurrentPlayer from "./CurrentPlayer";

// const URL = window.location.hostname + ":5000"

interface AppState {
    id: string
    boardState: State
}

function App() {
    const [gameState, setGameState] = useState<AppState>({id: "waiting...", boardState: startState});
    console.log(startState)
    const boardFromState = getBoardFromState(gameState.boardState)
    const coordinates = createCoordinates()
    const stateUpdate = (coordinates: any) =>
        setGameState({
            id: gameState.id,
            boardState: updateState(coordinates, gameState.boardState)
        })

    useEffect(() => {
        console.log("wowee")
        // const websocket = new WebSocket("ws://" + URL + "/ws")
        // websocket.onopen = () => websocket.send("id")
        // websocket.onmessage = msg => setState({ id: msg.data, boardState: gameState.boardState })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Your ID is: {gameState.id}</h1>
            <p className="w-10">{gameState.boardState.winner} is win</p>
            <div className="flex flex-col items-center justify-center">
                <Board
                    state={boardFromState}
                    coordinates={coordinates}
                    updateState={stateUpdate}
                />
                <div className='pl-4 self-start'>
                    <CurrentPlayer currentPlayer={gameState.boardState.turn} />
                </div>
            </div>
        </div>
    );
}

export default App;
