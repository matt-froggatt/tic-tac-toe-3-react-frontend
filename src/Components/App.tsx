import React, { useState, useEffect, useRef } from "react";
import { styled } from "linaria/react";
import Table from "./Table";
import startState, {
	updateState,
	getBoardInfo,
	isBoard,
	getBoardFromState,
	createCoordinates,
	updateCoordinates,
} from "../gameRules";
import Cell from "./Cell";

const URL = window.location.hostname + ":5000"



const CentredDiv = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const WinnerP = styled.p`
	margin: 10vh;
`;

function genTable(
	state: any,
	coordinates: any,
	updateState: Function
): any[][] {
	return getBoardInfo(state).map((outer: any, i: number) =>
		outer.map((inner: any, j: number) =>
			isBoard(inner) ? (
				<Table key={"0" + i + j}>
					{genTable(
						inner,
						updateCoordinates(coordinates, i, j),
						updateState)
					}
				</Table>
			) : (
					<Cell
						key={"1" + i + j}
						updateState={() => updateState(updateCoordinates(coordinates, i, j))}
					>
						{inner}
					</Cell>
				)
		)
	);
}

function App() {
	const [state, setState] = useState({ id: "waiting...", boardState: startState });

	useEffect(() => {
		console.log("wowee")
		const websocket = new WebSocket("ws://" + URL + "/ws")
		websocket.onopen = msg => websocket.send("id")
		websocket.onmessage = msg => setState({ id: msg.data, boardState: state.boardState })
	}, [])

	return (
		<CentredDiv>
			<h1>Your ID is: {state.id}</h1>
			<WinnerP>{state.boardState.winner} is win</WinnerP>
			<Table>
				{genTable(
					getBoardFromState(state.boardState),
					createCoordinates(),
					(coordinates: any) =>
						setState({ id: state.id, boardState: updateState(coordinates, state.boardState) })
				)}
			</Table>
		</CentredDiv>
	);
}

export default App;
