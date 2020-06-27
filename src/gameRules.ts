interface InnerState {
	winner: string;
	state: InnerState[][] | string[][];
}

interface Coordinate {
	x: number,
	y: number
}

export interface Coordinates {
	data: Coordinate[]
}

interface State {
	winner: string;
	turn: string;
	lastPlayed: number[];
	board: InnerState;
}

const startState: State = {
	winner: "",
	turn: "X",
	lastPlayed: [-1, -1],
	board:
	{
		winner: "",
		state: [
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
	}
};

//function whoWon(state: InnerState): string {
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
//				state.state[a1][a2] !== "" &&
//				state.state[a1][a2] === state.state[b1][b2] &&
//				state.state[a1][a2] === state.state[c1][c2]
//			) {
//				return state.state[a1][a2];
//			}
//		}
//		return "";
//	}
//	return state.winner;
//}


//function updateNoWinnerInner(i: number, j: number, x: number, y: number, outerX: number, outerY: number, outerColumn: string[][], state: State): string[][] {
//
//	return outerColumn.map((row: string[], k: number) =>
//		row.map((column: string, l: number) =>
//			((state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) || (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1])) && state.board[i][j].state[k][l] === "" && i === outerY && j === outerX && k === y && l === x
//				? state.turn
//				: state.board[i][j].state[k][l]
//		)
//	)
//}

//function updateNoWinner(outerX: number, outerY: number, x: number, y: number, state: State): State {
//	return {
//		winner: state.winner,
//		turn: state.turn === "X" ? "O" : "X",
//		lastPlayed: (outerX === state.lastPlayed[0] && outerY === state.lastPlayed[1]) || (state.lastPlayed[0] === -1 && state.lastPlayed[1] === -1) ? [x, y] : state.lastPlayed,
//		board: state.winner === "" ? state.board.map((outerRow: InnerState[], i: number) =>
//			outerRow.map((outerColumn: InnerState, j: number) => {
//				if (outerColumn.winner === "") {
//					let tempState = updateNoWinnerInner(i, j, x, y, outerX, outerY, outerColumn.state, state);
//					return { winner: whoWon({ winner: outerColumn.winner, state: tempState }), state: tempState };
//				} else return outerColumn;
//			})
//		) : state.board
//
//	};
//}

function changeAtCoordinates(coordinates: Coordinates, board: InnerState, change: Function): InnerState {
	const temp = coordinates.data.shift();
	const dataItem = board.state[temp!.x][temp!.y]
	if (isBoard(dataItem)) {
		board.state[temp!.x][temp!.y] = changeAtCoordinates(coordinates, dataItem, change);
		return board;
	} else {
		board.state[temp!.x][temp!.y] = change(dataItem);
		return board;
	}
	return board;
}

export function updateState(coordinates: Coordinates, state: State): State {
	return {
		winner: state.winner, // Check winners of InnerStates
		lastPlayed: state.lastPlayed,
		turn: state.turn === "X" ? "O" : "X",
		board: changeAtCoordinates(coordinates, state.board, () => state.turn)
	};
}

export function isBoard(state: any): state is InnerState {
	return typeof state != "string";
}

export function getBoardInfo(state: InnerState): any[][] {
	return state.state;
}

export function getBoardFromState(state: State): InnerState {
	return state.board;
}

export function createCoordinates() {
	return { data: [] }
}

export function updateCoordinates(coordinates: Coordinates, x: number, y: number): Coordinates {
	let temp = { data: coordinates.data.slice() }
	temp.data.push({ x: x, y: y })
	return temp
}

export default startState;
