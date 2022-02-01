import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, State, updateState,} from "../gameRules";
import Board from "./Board/Board";
import CurrentPlayer from "./Board/CurrentPlayer";
import WinnerModal from "./Modal/WinnerModal";
import IdModal from "./Modal/IdModal";

const URL = window.location.hostname + ":8080"

function App() {
    const [id, ] = useState<number>()
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [boardState, setBoardState] = useState<State>(startState)
    const boardFromState = getBoardFromState(boardState)
    const coordinates = createCoordinates()
    const stateUpdate = (coordinates: any) =>
        setBoardState(updateState(coordinates, boardState))

    const playAgain = () => setBoardState(startState)

    useEffect(() => {
        let socket = new WebSocket(`ws://${URL}/ws`);
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
                <CurrentPlayer currentPlayer={boardState.turn}/>
            </div>
            <IdModal id={id} onIdSubmit={() => {
                setGameStarted(true)
            }} gameStarted={gameStarted}/>
            <WinnerModal winner={boardState.winner} onPlayAgain={playAgain}/>
        </div>
    );
}

export default App;
