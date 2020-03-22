import React, { useState } from "react";
import { styled } from "linaria/react";
import Octothorp from "./Octothorp";

const CentredDiv = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

function updateState(x: number, y: number, state: any) {
	return {
		winner: "",
		turn: state.turn === "X" ? "O" : "X",
		board:
			state.winner === ""
				? state.board.map((row: string[], i: number) =>
						row.map((column: string, j) =>
							state.board[i][j] === "" && i === y && j === x
								? state.turn
								: state.board[i][j]
						)
				  )
				: state.board
	};
}

function App() {
	const [state, setState] = useState({
		winner: "",
		turn: "X",
		board: [
			["", "", ""],
			["", "", ""],
			["", "", ""]
		]
	});

	return (
		<CentredDiv>
			<p>{state.winner} is win</p>
			<Octothorp
				data={state.board}
				updateData={(x: number, y: number) =>
					setState(updateState(x, y, state))
				}
			/>
		</CentredDiv>
	);
}

export default App;
