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

function App() {
	const [state, setState] = useState({
		turn: "X",
		board: [
			["", "", ""],
			["", "", ""],
			["", "", ""]
		]
	});

	return (
		<CentredDiv>
			<Octothorp
				data={state.board}
				updateData={(x: number, y: number) =>
					setState({
						turn: state.turn === "X" ? "O" : "X",
						board: state.board.map((row: string[], i) =>
							row.map((column: string, j) =>
								state.board[i][j] === "" && i === y && j === x
									? state.turn
									: state.board[i][j]
							)
						)
					})
				}
			/>
		</CentredDiv>
	);
}

export default App;
