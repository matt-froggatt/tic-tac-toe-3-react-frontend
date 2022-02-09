import * as R from 'ramda'

// Need to update game based on message
// TODO update to use ramda
export interface BoardState {
    winner: Player
    isPlayable: boolean
    containedItems: BoardState[][] | Player[][]
}

type Coordinate = {
    x: number
    y: number
}

export type Coordinates = {
    data: Coordinate[]
}

export interface GameState {
    winner: Player
    turn: Player
    board: BoardState
}

export enum Player {
    X = "X",
    O = "O",
    NONE = ""
}

// TODO add typing
export const isBoard = (state: any): state is BoardState => R.not(R.equals(typeof state, "string"))

// TODO add typing
const isArrayOfBoardArray = (arr: any[][]): arr is BoardState[][] => R.all<any[]>(R.all(isBoard))(arr)

const performOnBoardStateContainedItems = <T>(fnIfBoardState: (arr: BoardState[][]) => T, fnIfPlayer: (val: Player[][]) => T, containedItems: BoardState[][] | Player[][]): T =>
    R.ifElse(
        isArrayOfBoardArray,
        (item) =>
            fnIfBoardState(item as BoardState[][]),
        (item) => fnIfPlayer(item as Player[][])
    )(containedItems)

const generate2dArrayOf = <T>(width: number, height: number, itemCreator: () => T): T[][] => R.times(() => R.times(itemCreator, width), height)

const generateStartInnerBoard = (levels = 2, width = 3, height = 3): BoardState => ({
    winner: Player.NONE,
    isPlayable: true,
    containedItems: levels === 1 ? generate2dArrayOf(width, height, () => Player.NONE) : generate2dArrayOf(width, height, () => generateStartInnerBoard(levels - 1, width, height))
})

const generateStartState = ({levels = 2, width = 3, height = 3}): GameState => ({
        winner: Player.NONE,
        turn: Player.X,
        board: generateStartInnerBoard(levels, width, height)
    }
)

const startState = generateStartState({width: 3, height: 3})

// TODO add typing
const changeAtIndex = (array: any[], value: any, index: number): any[] => R.set(R.lensIndex(index), value, array)

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

const firstCoordinate = (coordinates: Coordinates): Coordinate => R.head(coordinates.data)!

const restCoordinates = (coordinates: Coordinates): Coordinates => ({data: R.tail(coordinates.data)})

const isAnyEmpty: (squares: Player[][]) => boolean = R.any<Player[]>(R.any<Player>(player => R.equals(Player.NONE, player)))

const isBoardFull = (board: BoardState): boolean => isArrayOfBoardArray(board.containedItems) ?
    R.reduce((value, item) =>
        value ||
        R.reduce((value, item) =>
            value || isBoardFull(item), false as boolean, item), false as boolean, board.containedItems) : isAnyEmpty(board.containedItems)

const getBoardAtCoordinates = (coordinates: Coordinates, board: BoardState): BoardState => coordinates === EmptyCoordinates || !isArrayOfBoardArray(board.containedItems) ?
    board : getBoardAtCoordinates(restCoordinates(coordinates), board.containedItems[firstCoordinate(coordinates).x][firstCoordinate(coordinates).y])

const isBoardAtCoordinatesFull = (coordinates: Coordinates, state: GameState): boolean =>
    isBoardFull(getBoardAtCoordinates(coordinates, getBoardFromState(state)))

const updatePlayable = (playableCoordinate: Coordinate, board: BoardState, isParentPlayable = false, currentCoordinates: Coordinates = EmptyCoordinates): BoardState => ({
    winner: board.winner,
    isPlayable: isParentPlayable || (firstCoordinate(currentCoordinates) && R.equals(playableCoordinate, firstCoordinate(currentCoordinates))),
    containedItems: isArrayOfBoardArray(board.containedItems) ?
        board.containedItems.map(
            (array, x) =>
                array.map(
                    (item, y) =>
                        updatePlayable(playableCoordinate, item, isParentPlayable || (firstCoordinate(currentCoordinates) && R.equals(playableCoordinate, firstCoordinate(currentCoordinates))), updateCoordinates(currentCoordinates, x, y))
                )
        ) : board.containedItems
})

const CONTAINED_ITEMS: keyof BoardState = 'containedItems'

const asBoard = (item: BoardState | Player): BoardState => item as BoardState

const asPlayer = (item: BoardState | Player): Player => item as Player

const getWinnerOfCell = R.ifElse<(BoardState | Player)[], Player, Player>(
    isBoard,
    (item) => winnerOfBoard(asBoard(item).containedItems),
    (item) => asPlayer(item)
)

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

export function updateState(coordinates: Coordinates, state: GameState): GameState {
    const newBoard = changeAtCoordinates(coordinates, state.board, () => state.turn);
    let winnerUpdatedBoard

    if (newBoard) winnerUpdatedBoard = updateWinner(newBoard)

    return {
        winner: newBoard && winnerUpdatedBoard ? winnerUpdatedBoard.winner : state.winner, // Check winners of InnerStates
        turn: newBoard ? state.turn === Player.X ? Player.O : Player.X : state.turn,
        board: newBoard && winnerUpdatedBoard ? updatePlayable(R.last(coordinates.data)!, winnerUpdatedBoard, !isBoardAtCoordinatesFull({data: [R.last(coordinates.data)!]}, state)) : state.board
    }
}

// TODO add typing
export const getBoardInfo = (state: BoardState): any[][] => state.containedItems

export const getBoardFromState = (state: GameState): BoardState => state.board

export const createCoordinates = () => ({data: []})

export const updateCoordinates = (coordinates: Coordinates, x: number, y: number): Coordinates => ({
    data: R.append({
        x: x,
        y: y
    }, coordinates.data)
})

export default startState;
