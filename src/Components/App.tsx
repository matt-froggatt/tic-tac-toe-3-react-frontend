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
import WinnerModal from "./Modal/WinnerModal";
import IdModal from "./Modal/IdModal";

const URL = window.location.hostname + ":8080"

const useBoard: () => [BoardState, Player, Player, (c: Coordinates) => void, () => void] = () => {
    const [state, setState] = useState<State>(startState)
    const playAtCoordinates = (coordinates: Coordinates) => setState(updateState(coordinates, state))
    const playAgain = () => setState(startState)
    const board = getBoardFromState(state)
    const turn = state.turn
    const winner = state.winner
    return [board, winner, turn, playAtCoordinates, playAgain]
}

const connectToWebSocket = () => {
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
}

const coordinates = createCoordinates()

function App() {
    const [id, ] = useState<number>()
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [board, winner, turn, playAtCoordinates, playAgain] = useBoard()

    useEffect(connectToWebSocket, [])

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
