interface State {
	winner: string;
	turn: string;
	board: string[][];
}

const startState = {
	winner: "",
	turn: "X",
	board: [
		["", "", ""],
		["", "", ""],
		["", "", ""]
	]
};

function whoWon(state: State): string {
	if (state.winner === "") {
		const lines = [
			[
				[0, 0],
				[0, 1],
				[0, 2]
			],
			[
				[1, 0],
				[1, 1],
				[1, 2]
			],
			[
				[2, 0],
				[2, 1],
				[2, 2]
			],
			[
				[0, 0],
				[1, 0],
				[2, 0]
			],
			[
				[0, 1],
				[1, 1],
				[2, 1]
			],
			[
				[0, 2],
				[1, 2],
				[2, 2]
			],
			[
				[0, 0],
				[1, 1],
				[2, 2]
			],
			[
				[0, 2],
				[1, 1],
				[2, 0]
			]
		];
		for (let i = 0; i < lines.length; i++) {
			const [[a1, a2], [b1, b2], [c1, c2]] = lines[i];
			if (
				state.board[a1][a2] !== "" &&
				state.board[a1][a2] === state.board[b1][b2] &&
				state.board[a1][a2] === state.board[c1][c2]
			) {
				return state.board[a1][a2];
			}
		}
		return "";
	}
	return state.winner;
}

function updateNoWinner(x: number, y: number, state: State): State {
	return {
		winner: state.winner,
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

export function updateState(x: number, y: number, state: State): State {
	const tempState = updateNoWinner(x, y, state);
	return {
		winner: whoWon(tempState),
		turn: tempState.turn,
		board: tempState.board
	};
}

export default startState;
