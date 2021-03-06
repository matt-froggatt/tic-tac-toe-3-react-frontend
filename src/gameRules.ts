// Need to update game based on message

export interface BoardState {
    winner: Player
    isPlayable: boolean
    containedItems: BoardState[][] | Player[][]
}

interface Coordinate {
    x: number
    y: number
}

export interface Coordinates {
    data: Coordinate[]
}

export interface State {
    winner: Player
    turn: Player
    board: BoardState
}

export enum Player {
    X = "X",
    O = "O",
    NONE = ""
}

function generateArrayOfArraysOf<T>(itemCreator: () => T, width: number, height: number): T[][] {
    const array = Array(height)
    for (let i = 0; i < array.length; ++i) {
        const innerArray = Array(width)
        for (let j = 0; j < innerArray.length; ++j) innerArray[j] = itemCreator()
        array[i] = innerArray
    }
    return array
}

function generateStartInnerState(levels = 2, width = 3, height = 3): BoardState {
    return {
        winner: Player.NONE,
        isPlayable: true,
        containedItems: levels === 1 ? generateArrayOfArraysOf(() => Player.NONE, width, height) : generateArrayOfArraysOf(() => generateStartInnerState(levels - 1, width, height), width, height)
    }
}

function generateStartState({levels = 2, width = 3, height = 3}): State {
    return {
        winner: Player.NONE,
        turn: Player.X,
        board: generateStartInnerState(levels, width, height)
    }
}

const startState = generateStartState({width: 3, height: 3})

function first<T>(array: T[]): T {
    return array[0];
}

function last<T>(array: T[]): T {
    return array[array.length - 1];
}

function rest<T>(array: T[]): T[] {
    return array.slice(1, array.length)
}

function changeAtIndex(array: any[], value: any, index: number): any[] {
    let newArray = array.slice()
    newArray[index] = value
    return newArray
}

function coordinatesFromArray(array: Coordinate[]): Coordinates {
    return {data: array}
}

function changeAtCoordinates(coordinates: Coordinates, board: BoardState, change: Function): BoardState | false {
    const firstCoord = first(coordinates.data);
    const cell = board.containedItems[firstCoord.x][firstCoord.y]
    let returnValue: BoardState | false = false
    if (isBoard(cell)) {
        const tempCell = changeAtCoordinates(coordinatesFromArray(rest(coordinates.data)), cell, change)
        if (tempCell) {
            returnValue = {
                winner: board.winner,
                isPlayable: board.isPlayable,
                containedItems: changeAtIndex(board.containedItems, changeAtIndex(board.containedItems[firstCoord.x], tempCell, firstCoord.y), firstCoord.x)
            }
        }
    } else if (board.containedItems[firstCoord.x][firstCoord.y] === Player.NONE) {
        returnValue = {
            winner: board.winner,
            isPlayable: board.isPlayable,
            containedItems: changeAtIndex(board.containedItems, changeAtIndex(board.containedItems[firstCoord.x], change(cell), firstCoord.y), firstCoord.x)
        }
    }

    return returnValue
}

const EmptyCoordinates = {data: []};

function isArrayOfBoardArray(arrayOfArrays: any[][]): arrayOfArrays is BoardState[][] {
    for (let array of arrayOfArrays) {
        for (let item of array) {
            if (!isBoard(item)) return false
        }
    }
    return true
}

function firstCoordinate(coordinates: Coordinates): Coordinate {
    return first(coordinates.data)
}

function restCoordinates(coordinates: Coordinates): Coordinates {
    return {data: rest(coordinates.data)}
}

function coordinatesEq(c1: Coordinate, c2: Coordinate): boolean {
    return c1.x === c2.x && c1.y === c2.y
}

// TODO make full everything playable when selected square is full

function isAnyEmpty(squares: Player[][]): boolean {
    for (const array of squares) {
        for (const square of array) {
            if (square === Player.NONE) return true
        }
    }
    return false
}

function foldr<T, S>(array: T[], start: S, func: (item: T, value: S) => S): S {
    if (array.length === 0) {
        return start
    }
    return func(first(array), foldr(rest(array), start, func))
}

function isBoardFull(board: BoardState): boolean {
    return isArrayOfBoardArray(board.containedItems) ?
        foldr(
            board.containedItems,
            false as boolean,
            (item, value) =>
                value ||
                foldr(
                    item,
                    false as boolean,
                    (item, value) =>
                        value || isBoardFull(item)
                )
        ) : isAnyEmpty(board.containedItems)
}

function getBoardAtCoordinates(coordinates: Coordinates, board: BoardState): BoardState {
    const firstCoord = firstCoordinate(coordinates)
    return coordinates === EmptyCoordinates || !isArrayOfBoardArray(board.containedItems) ?
        board : getBoardAtCoordinates(restCoordinates(coordinates), board.containedItems[firstCoord.x][firstCoord.y])
}

function isBoardAtCoordinatesFull(coordinates: Coordinates, state: State): boolean {
    return isBoardFull(getBoardAtCoordinates(coordinates, getBoardFromState(state)))
}

function updatePlayable(playableCoordinate: Coordinate, board: BoardState, isParentPlayable = false, currentCoordinates: Coordinates = EmptyCoordinates): BoardState {
    const isPlayable = isParentPlayable || (firstCoordinate(currentCoordinates) && coordinatesEq(playableCoordinate, firstCoordinate(currentCoordinates)))
    return {
        winner: board.winner,
        isPlayable: isPlayable,
        containedItems: isArrayOfBoardArray(board.containedItems) ?
            board.containedItems.map(
                (array, x) =>
                    array.map(
                        (item, y) =>
                            updatePlayable(playableCoordinate, item, isPlayable, updateCoordinates(currentCoordinates, x, y))
                    )
            ) : board.containedItems
    }
}

function push<T>(array: T[], item: T): T[] {
    const newArray = array.slice()
    newArray.push(item)
    return newArray
}

function arrayUnzip<A, B>(array: [A, B][]): [A[], B[]] {
    const [a, b] = first(array)

    if (array.length === 0) {
        return [[a], [b]]
    }

    const [newArrayA, newArrayB] = arrayUnzip(rest(array))
    return [push(newArrayA, a), push(newArrayB, b)]
}

function min(a: number, b: number): number {
    return a < b ? a : b
}

function getWinnerOfCell(item: BoardState | Player): Player {
    return isBoard(item) ? winnerOfBoard(item.containedItems) : item
}

function verticalWinner(board: BoardState[][] | Player[][], column: number): Player {
    let prevWinner = null

    for(let i = 0; i < board.length; ++i) {
        const currentWinner = getWinnerOfCell(board[i][column])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function horizontalWinner(board: BoardState[][] | Player[][], row: number): Player {
    let prevWinner = null
    const array = board[row]

    for(let i = 0; i < array.length; ++i) {
        const currentWinner = getWinnerOfCell(array[i])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function antiDiagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = min(board.length, board[0].length);

    for(let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][board[i].length - 1 - i])
        if (prevWinner != null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function diagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = min(board.length, board[0].length);

    for(let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][i])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function winnerOfBoard(board: BoardState[][] | Player[][]): Player {
    for(let i = 0; i < board.length; ++i) {
        const tempHorizontalWinner = horizontalWinner(board, i)
        if (tempHorizontalWinner !== Player.NONE) return tempHorizontalWinner
    }

    for(let i = 0; i < board[0].length; ++i) {
        const tempVerticalWinner = verticalWinner(board, i)
        if (tempVerticalWinner !== Player.NONE) return tempVerticalWinner
    }

    const tempDiagonalWinner = diagonalWinner(board)
    if (tempDiagonalWinner !== Player.NONE) return tempDiagonalWinner

    const tempAntiDiagonalWinner = antiDiagonalWinner(board)
    if (tempAntiDiagonalWinner !== Player.NONE) return tempAntiDiagonalWinner

    return Player.NONE
}

function updateWinner(board: BoardState): BoardState {
    if (board.winner === Player.NONE) {
        const contents = board.containedItems
        const newContents = isArrayOfBoardArray(contents) ? contents.map(
            array =>
                array.map(
                    item =>
                        updateWinner(item)
                )
        ) : contents

        return {
            ...board,
            winner: winnerOfBoard(newContents),
            containedItems: newContents
        }
    }

    return board
}

export function updateState(coordinates: Coordinates, state: State): State {
    const newBoard = changeAtCoordinates(coordinates, state.board, () => state.turn);
    let winnerUpdatedBoard

    if (newBoard) winnerUpdatedBoard = updateWinner(newBoard)

    const updatedState = {
        winner: newBoard && winnerUpdatedBoard ? winnerUpdatedBoard.winner : state.winner, // Check winners of InnerStates
        turn: newBoard ? state.turn === Player.X ? Player.O : Player.X : state.turn,
        board: newBoard && winnerUpdatedBoard ? updatePlayable(last(coordinates.data), winnerUpdatedBoard, !isBoardAtCoordinatesFull({data: [last(coordinates.data)]}, state)) : state.board
    }

    console.log(updatedState)

    return updatedState
}

export function isBoard(state: any): state is BoardState {
    return typeof state != "string";
}

export function getBoardInfo(state: BoardState): any[][] {
    return state.containedItems;
}

export function getBoardFromState(state: State): BoardState {
    return state.board;
}

export function createCoordinates() {
    return {data: []}
}

export function updateCoordinates(coordinates: Coordinates, x: number, y: number): Coordinates {
    let temp = {data: coordinates.data.slice()}
    temp.data.push({x: x, y: y})
    return temp
}

export default startState;
