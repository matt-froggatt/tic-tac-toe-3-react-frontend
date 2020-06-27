import React, { useState } from "react";
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
	const [state, setState] = useState(startState);

	return (
		<CentredDiv>
			<WinnerP>{state.winner} is win</WinnerP>
			<Table>
				{genTable(
					getBoardFromState(state),
					createCoordinates(),
					(coordinates: any) =>
						setState(updateState(coordinates, state))
				)}
			</Table>
		</CentredDiv>
	);
}

export default App;
