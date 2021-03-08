import React, {useEffect, useState} from "react";
import startState, {createCoordinates, getBoardFromState, updateState,} from "../gameRules";
import Board from "./Board";

// const URL = window.location.hostname + ":5000"

function App() {
    const [state, setState] = useState({id: "waiting...", boardState: startState});
    const boardFromState = getBoardFromState(state.boardState)
    const coordinates = createCoordinates()
    const stateUpdate = (coordinates: any) =>
        setState({
            id: state.id,
            boardState: updateState(coordinates, state.boardState)
        })

    useEffect(() => {
        console.log("wowee")
        // const websocket = new WebSocket("ws://" + URL + "/ws")
        // websocket.onopen = () => websocket.send("id")
        // websocket.onmessage = msg => setState({ id: msg.data, boardState: state.boardState })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Your ID is: {state.id}</h1>
            <p className="w-10">{state.boardState.winner} is win</p>
            <Board
                state={boardFromState}
                coordinates={coordinates}
                updateState={stateUpdate}
            />
        </div>
    );
}

export default App;
