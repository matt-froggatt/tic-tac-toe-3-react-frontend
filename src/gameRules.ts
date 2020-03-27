import { ReactElement } from "react";

interface State {
	winner: string;
	turn: string;
	lastPlayed: number[];
	board: string[][][][];
}

const startState = {
	winner: "",
	turn: "X",
	lastPlayed: [-1, -1],
	board: [
		[
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			]

		],
		[
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			]

		],
		[
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			],
			[
				["", "", ""],
				["", "", ""],
				["", "", ""]
			]

		]
	]
};

//function whoWon(state: State): string {
//	if (state.winner === "") {
//		const lines = [
//			[
//				[0, 0],
//				[0, 1],
//				[0, 2]
//			],
//			[
//				[1, 0],
//				[1, 1],
//				[1, 2]
//			],
//			[
//				[2, 0],
//				[2, 1],
//				[2, 2]
//			],
//			[
//				[0, 0],
//				[1, 0],
//				[2, 0]
//			],
//			[
//				[0, 1],
//				[1, 1],
//				[2, 1]
//			],
//			[
//				[0, 2],
//				[1, 2],
//				[2, 2]
//			],
//			[
//				[0, 0],
//				[1, 1],
//				[2, 2]
//			],
//			[
//				[0, 2],
//				[1, 1],
//				[2, 0]
//			]
//		];
//		for (let i = 0; i < lines.length; i++) {
//			const [[a1, a2], [b1, b2], [c1, c2]] = lines[i];
//			if (
//				state.board[a1][a2] !== "" &&
//				state.board[a1][a2] === state.board[b1][b2] &&
//				state.board[a1][a2] === state.board[c1][c2]
//			) {
//				return state.board[a1][a2];
//			}
//		}
//		return "";
//	}
//	return state.winner;
//}
//
function updateNoWinner(outerX: number, outerY: number, x: number, y: number, state: State): State {
	return {
		winner: state.winner,
		turn: state.turn === "X" ? "O" : "X",
		lastPlayed: (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1]) || (state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) ? [x, y] : state.lastPlayed,
		board:
			state.winner === ""
				? state.board.map((outerRow: string[][][], i: number) =>
					outerRow.map((outerColumn: string[][], j: number) =>
						outerColumn.map((row: string[], k: number) =>
							row.map((column: string, l: number) =>
								((state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) || (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1])) && state.board[i][j][k][l] === "" && i === outerY && j === outerX && k === y && l === x
									? state.turn
									: state.board[i][j][k][l]
							)
						)
					)
				)
				: state.board
	};
}

export function updateState(outerX: number, outerY: number, x: number, y: number, state: State): State {
	const tempState = updateNoWinner(outerX, outerY, x, y, state);
	return {
		winner: "",
		lastPlayed: tempState.lastPlayed,
		turn: tempState.turn,
		board: tempState.board
	};
}

export default startState;
