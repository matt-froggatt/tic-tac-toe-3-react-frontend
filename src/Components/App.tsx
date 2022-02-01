import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, State, updateState,} from "../gameRules";
import Board from "./Board/Board";
import CurrentPlayer from "./Board/CurrentPlayer";
import WinnerModal from "./Modal/WinnerModal";
import IdModal from "./Modal/IdModal";

const URL = window.location.hostname + ":8080"

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
        setGameState({...gameState, boardState: updateState(coordinates, gameState.boardState)})

    const playAgain = () => setGameState({...gameState, boardState: startState})

    useEffect(() => {
        let socket = new WebSocket("ws://127.0.0.1:8080/ws");
        console.log("Attempting Connection...");

        socket.onopen = () => {
            console.log("Successfully Connected");
            socket.send("Hi From the Client!")
        };
        
        socket.onmessage = msg => console.log(msg.data)

        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
            socket.send("Client Closed!")
        };

        socket.onerror = error => {
            console.log("Socket Error: ", error);
        };
    }, [])

    return (
        <div className="flex flex-row items-center justify-center w-screen h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <Board
                    state={boardFromState}
                    coordinates={coordinates}
                    updateState={stateUpdate}
                />
                <CurrentPlayer currentPlayer={gameState.boardState.turn}/>
            </div>
            <IdModal id={gameState.id} onIdSubmit={() => {
                setGameState({...gameState, gameStarted: true})
            }} gameStarted={gameState.gameStarted}/>
            <WinnerModal winner={gameState.boardState.winner} onPlayAgain={playAgain}/>
        </div>
    );
}

export default App;
