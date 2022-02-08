import * as R from 'ramda'

// Need to update game based on message
// TODO update to use ramda
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

const generateStartInnerState = (levels = 2, width = 3, height = 3): BoardState => ({
    winner: Player.NONE,
    isPlayable: true,
    containedItems: levels === 1 ? generateArrayOfArraysOf(() => Player.NONE, width, height) : generateArrayOfArraysOf(() => generateStartInnerState(levels - 1, width, height), width, height)
})

const generateStartState = ({levels = 2, width = 3, height = 3}): State => ({
        winner: Player.NONE,
        turn: Player.X,
        board: generateStartInnerState(levels, width, height)
    }
)

const startState = generateStartState({width: 3, height: 3})

// TODO add typing
function changeAtIndex(array: any[], value: any, index: number): any[] {
    let newArray = array.slice()
    newArray[index] = value
    return newArray
}

const coordinatesFromArray = (array: Coordinate[]): Coordinates => ({data: array})

function changeAtCoordinates(coordinates: Coordinates, board: BoardState, change: Function): BoardState | false {
    const firstCoord = R.head(coordinates.data)!
    const cell = board.containedItems[firstCoord.x][firstCoord.y]
    let returnValue: BoardState | false = false
    if (isBoard(cell)) {
        const tempCell = changeAtCoordinates(coordinatesFromArray(R.tail(coordinates.data)), cell, change)
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

// TODO add typing
function isArrayOfBoardArray(arrayOfArrays: any[][]): arrayOfArrays is BoardState[][] {
    for (let array of arrayOfArrays) {
        for (let item of array) {
            if (!isBoard(item)) return false
        }
    }
    return true
}

const firstCoordinate = (coordinates: Coordinates): Coordinate => R.head(coordinates.data)!

const restCoordinates = (coordinates: Coordinates): Coordinates => ({data: R.tail(coordinates.data)})

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
    return func(R.head(array)!, foldr(R.tail(array), start, func))
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

const isBoardAtCoordinatesFull = (coordinates: Coordinates, state: State): boolean =>
    isBoardFull(getBoardAtCoordinates(coordinates, getBoardFromState(state)))

function updatePlayable(playableCoordinate: Coordinate, board: BoardState, isParentPlayable = false, currentCoordinates: Coordinates = EmptyCoordinates): BoardState {
    const isPlayable = isParentPlayable || (firstCoordinate(currentCoordinates) && R.equals(playableCoordinate, firstCoordinate(currentCoordinates)))
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

const getWinnerOfCell = (item: BoardState | Player): Player => isBoard(item) ? winnerOfBoard(item.containedItems) : item

function verticalWinner(board: BoardState[][] | Player[][], column: number): Player {
    let prevWinner = null

    for (let i = 0; i < board.length; ++i) {
        const currentWinner = getWinnerOfCell(board[i][column])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function horizontalWinner(board: BoardState[][] | Player[][], row: number): Player {
    let prevWinner = null
    const array = board[row]

    for (let i = 0; i < array.length; ++i) {
        const currentWinner = getWinnerOfCell(array[i])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function antiDiagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = R.min(board.length, board[0].length);

    for (let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][board[i].length - 1 - i])
        if (prevWinner != null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function diagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = R.min(board.length, board[0].length);

    for (let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][i])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function winnerOfBoard(board: BoardState[][] | Player[][]): Player {
    for (let i = 0; i < board.length; ++i) {
        const tempHorizontalWinner = horizontalWinner(board, i)
        if (tempHorizontalWinner !== Player.NONE) return tempHorizontalWinner
    }

    for (let i = 0; i < board[0].length; ++i) {
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
        board: newBoard && winnerUpdatedBoard ? updatePlayable(R.last(coordinates.data)!, winnerUpdatedBoard, !isBoardAtCoordinatesFull({data: [R.last(coordinates.data)!]}, state)) : state.board
    }

    console.log(updatedState)

    return updatedState
}

// TODO add typing
export const isBoard = (state: any): state is BoardState => typeof state != "string";

// TODO add typing
export const getBoardInfo = (state: BoardState): any[][] => state.containedItems

export const getBoardFromState = (state: State): BoardState => state.board


export const createCoordinates = () => ({data: []})

export const updateCoordinates = (coordinates: Coordinates, x: number, y: number): Coordinates => ({
    data: R.append({
        x: x,
        y: y
    }, coordinates.data)
})

export default startState;
