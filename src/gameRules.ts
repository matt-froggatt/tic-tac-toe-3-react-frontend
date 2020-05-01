interface InnerState {
	winner: string;
	state: string[][];
}

interface State {
	winner: string;
	turn: string;
	lastPlayed: number[];
	board: InnerState[][];
}

const startState = {
	winner: "",
	turn: "X",
	lastPlayed: [-1, -1],
	board: [
		[
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			}
			,
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			},
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			}

		],
		[
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			},
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			},
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			}

		],
		[
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			},
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			},
			{
				winner: "",
				state: [
					["", "", ""],
					["", "", ""],
					["", "", ""]
				]
			}

		]
	]
};

function whoWon(state: InnerState): string {
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
				state.state[a1][a2] !== "" &&
				state.state[a1][a2] === state.state[b1][b2] &&
				state.state[a1][a2] === state.state[c1][c2]
			) {
				return state.state[a1][a2];
			}
		}
		return "";
	}
	return state.winner;
}


function updateNoWinnerInner(i: number, j: number, x: number, y: number, outerX: number, outerY: number, outerColumn: string[][], state: State): string[][] {

	return outerColumn.map((row: string[], k: number) =>
		row.map((column: string, l: number) =>
			((state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) || (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1])) && state.board[i][j].state[k][l] === "" && i === outerY && j === outerX && k === y && l === x
				? state.turn
				: state.board[i][j].state[k][l]
		)
	)
}
function updateNoWinner(outerX: number, outerY: number, x: number, y: number, state: State): State {
	return {
		winner: state.winner,
		turn: state.turn === "X" ? "O" : "X",
		lastPlayed: (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1]) || (state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) ? [x, y] : state.lastPlayed,
		board: state.winner === "" ? state.board.map((outerRow: InnerState[], i: number) =>
			outerRow.map((outerColumn: InnerState, j: number) => {
				if (outerColumn.winner === "") {
					let tempState = updateNoWinnerInner(i, j, x, y, outerX, outerY, outerColumn.state, state);
					return { winner: whoWon({ winner: outerColumn.winner, state: tempState }), state: tempState };
				} else return outerColumn;
			})
		) : state.board

	};
}

export function updateState(outerX: number, outerY: number, x: number, y: number, state: State): State {
	const tempState = updateNoWinner(outerX, outerY, x, y, state);
	return {
		winner: "", // Check winners of InnerStates
		lastPlayed: tempState.lastPlayed,
		turn: tempState.turn,
		board: tempState.board
	};
}

export default startState;
