const startState = {
	winner: "",
	turn: "X",
	board: [
		["", "", ""],
		["", "", ""],
		["", "", ""]
	]
};

export function updateState(x: number, y: number, state: any) {
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

export default startState;
