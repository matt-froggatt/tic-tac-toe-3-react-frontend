import * as B from 'fp-ts-std/Boolean'
import * as s from 'fp-ts/string'
import * as A from 'fp-ts/Array'
import * as F from 'fp-ts-std/Function'
import * as f from 'fp-ts/function'
import * as Opt from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as n from 'fp-ts/number'
import * as N from 'fp-ts-std/Number'
import * as E from 'fp-ts/Eq'

// Need to update game based on message
// TODO add eslint
export enum Player {
    X = "X",
    O = "O",
    NONE = ""
}

export interface BoardState {
    winner: Player
    isPlayable: boolean
    containedItems: BoardState[][] | Player[][]
}

type Coordinate = {
    x: number
    y: number
}

const eqCoordinate: E.Eq<Coordinate> = {
    equals: (c1, c2) => B.and(n.Eq.equals(c1.x, c2.x))(n.Eq.equals(c1.y, c2.y))
}

export type Coordinates = {
    data: Coordinate[]
}

export interface GameState {
    winner: Player
    turn: Player
    board: BoardState
}

const eqPlayer: E.Eq<Player> = {
    equals: (player1, player2) => player1 === player2
}

const EmptyCoordinates = {data: []};

export const isBoard = (state: any): state is BoardState => B.invert(s.Eq.equals(typeof state, "string"))

export const getBoardFromState = (state: GameState): BoardState => state.board

export const createCoordinates = () => ({data: []})

export const updateCoordinates = (coordinates: Coordinates, x: number, y: number): Coordinates => ({
    data: A.append({
        x: x,
        y: y
    })(coordinates.data)
})

const isArrayOfBoardArray = (arr: any[][]): arr is BoardState[][] => A.every(A.every(isBoard))(arr)

// TODO add typing
export const getBoardInfo = (state: BoardState): any[][] => state.containedItems

const performOnBoardStateContainedItems = <T>(fnIfBoardState: (arr: BoardState[][]) => T, fnIfPlayer: (val: Player[][]) => T, containedItems: BoardState[][] | Player[][]): T =>
    F.ifElse<BoardState[][] | Player[][], T>(
        (item) =>
            fnIfBoardState(item as BoardState[][])
    )(
        (item) => fnIfPlayer(item as Player[][])
    )(isArrayOfBoardArray)(containedItems)

const generate2dArrayOf = <T>(itemCreator: () => T, width: number, height: number): T[][] => A.makeBy(height, () => A.makeBy(width, itemCreator))

const generateStartInnerBoard = (levels = 2, width = 3, height = 3): BoardState => ({
    winner: Player.NONE,
    isPlayable: true,
    containedItems: levels === 1 ?
        generate2dArrayOf(f.constant(Player.NONE), width, height) :
        generate2dArrayOf(f.constant(generateStartInnerBoard(levels - 1, width, height)), width, height)
})

const generateStartState = (levels = 2, width = 3, height = 3): GameState => ({
        winner: Player.NONE,
        turn: Player.X,
        board: generateStartInnerBoard(levels, width, height)
    }
)

const startState = generateStartState()

// TODO add typing
const changeAtIndex = (array: any[], value: any, index: number): any[] => Opt.getOrElse<any[]>(f.constant([]))(A.updateAt(index, value)(array))

const coordinatesFromArray = (array: Coordinate[]): Coordinates => ({data: array})

// TODO make more readable
const changeAtCoordinates = (value: Player, coordinates: Coordinates, board: BoardState): BoardState => ({
    winner: board.winner,
    isPlayable: board.isPlayable,
    containedItems:
        performOnBoardStateContainedItems(
            arr => changeAtIndex(board.containedItems,
                changeAtIndex(board.containedItems[Opt.toUndefined(A.head(coordinates.data))!.x],
                    changeAtCoordinates(value, coordinatesFromArray(Opt.toUndefined(A.tail(coordinates.data))!),
                        arr[Opt.toUndefined(A.head(coordinates.data))!.x][Opt.toUndefined(A.head(coordinates.data))!.y]),
                    Opt.toUndefined(A.head(coordinates.data))!.y),
                Opt.toUndefined(A.head(coordinates.data))!.x),
            () => changeAtIndex(
                board.containedItems,
                changeAtIndex(board.containedItems[Opt.toUndefined(A.head(coordinates.data))!.x], value, Opt.toUndefined(A.head(coordinates.data))!.y),
                Opt.toUndefined(A.head(coordinates.data))!.x
            ),
            board.containedItems
        )
})

const firstCoordinate = (coordinates: Coordinates): Coordinate => Opt.toUndefined(A.head(coordinates.data))!

const restCoordinates = (coordinates: Coordinates): Coordinates => ({data: Opt.toUndefined(A.tail(coordinates.data))!})

// TODO figure out how to replace ramda equals
const isAnyEmpty: (squares: Player[][]) => boolean = A.some<Player[]>(A.some<Player>(player => eqPlayer.equals(Player.NONE, player)))

// TODO make more readable
const isBoardFull = (board: BoardState): boolean => isArrayOfBoardArray(board.containedItems) ?
    A.reduce<BoardState[], boolean>(
        false as boolean,
        (value, item) =>
            value ||
            A.reduce<BoardState, boolean>(
                false as boolean,
                (value, item) =>
                    value || isBoardFull(item))(item))(
        board.containedItems
    ) : isAnyEmpty(board.containedItems)


const getBoardAtCoordinates = (coordinates: Coordinates, board: BoardState): BoardState => coordinates === EmptyCoordinates || !isArrayOfBoardArray(board.containedItems) ?
    board : getBoardAtCoordinates(restCoordinates(coordinates), board.containedItems[firstCoordinate(coordinates).x][firstCoordinate(coordinates).y])

const isBoardAtCoordinatesFull = (coordinates: Coordinates, state: GameState): boolean =>
    isBoardFull(getBoardAtCoordinates(coordinates, getBoardFromState(state)))

// TODO Determine how to replace ramda equals with FP-TS
const updatePlayable = (playableCoordinate: Coordinate, board: BoardState, isParentPlayable = false, currentCoordinates: Coordinates = EmptyCoordinates): BoardState => ({
    winner: board.winner,
    isPlayable: isParentPlayable || (firstCoordinate(currentCoordinates) && eqCoordinate.equals(playableCoordinate, firstCoordinate(currentCoordinates))),
    containedItems: isArrayOfBoardArray(board.containedItems) ?
        board.containedItems.map(
            (array, x) =>
                array.map(
                    (item, y) =>
                        updatePlayable(playableCoordinate, item, isParentPlayable || (firstCoordinate(currentCoordinates) && eqCoordinate.equals(playableCoordinate, firstCoordinate(currentCoordinates))), updateCoordinates(currentCoordinates, x, y))
                )
        ) : board.containedItems
})

const asBoard = (item: BoardState | Player): BoardState => item as BoardState

const asPlayer = (item: BoardState | Player): Player => item as Player

const getWinnerOfCell = F.ifElse<BoardState | Player, Player>((item) => winnerOfBoard(asBoard(item).containedItems))((item) => asPlayer(item))(isBoard)

// TODO extract and combine duplicated logic where possible
const columnWinner = (board: BoardState[][] | Player[][], column: number): Player =>
    Opt.getOrElse<Player>(f.constant(Player.NONE))(A.reduce<BoardState[] | Player[], Opt.Option<Player>>(
        Opt.none,
        (prevWinner, currentRow) =>
            F.unless<Opt.Option<Player>>(
                (currentWinner) =>
                    B.or(Opt.isNone(prevWinner))(Opt.getEq(eqPlayer).equals(currentWinner, prevWinner))
            )(f.constant(Opt.some(Player.NONE)))(Opt.some(getWinnerOfCell(currentRow[column])))
    )(board))

const rowWinner = (board: BoardState[][] | Player[][], row: number): Player =>
    Opt.getOrElse(f.constant(Player.NONE))(A.reduce<BoardState | Player, Opt.Option<Player>>(
        Opt.none,
        (prevWinner, currentRow) =>
            F.unless<Opt.Option<Player>>(
                (currentWinner) =>
                    B.or(Opt.isNone(prevWinner))(Opt.getEq(eqPlayer).equals(currentWinner, prevWinner))
            )(f.constant(Opt.some(Player.NONE)))(Opt.some(getWinnerOfCell(currentRow)))
    )(board[row]))


// TODO update to use ramda
function antiDiagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = Ord.min(n.Ord)(board.length, board[0].length);

    for (let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][board[i].length - 1 - i])
        if (prevWinner != null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function diagonalWinner(board: BoardState[][] | Player[][]): Player {
    let prevWinner = null

    const size = Ord.min(n.Ord)(board.length, board[0].length);

    for (let i = 0; i < size; ++i) {
        const currentWinner = getWinnerOfCell(board[i][i])
        if (prevWinner !== null && currentWinner !== prevWinner) return Player.NONE
        prevWinner = currentWinner
    }

    return prevWinner || Player.NONE
}

function winnerOfBoard(board: BoardState[][] | Player[][]): Player {
    const [, tempHorizontalWinner] = A.reduce<BoardState[] | Player[], [number, Player]>(
        [0, Player.NONE],
        ([index, result]) => [N.increment(index), result === Player.NONE ? rowWinner(board, index) : result]
    )(board)
    if (tempHorizontalWinner !== Player.NONE) return tempHorizontalWinner


    const [, tempVerticalWinner] = A.reduce<BoardState | Player, [number, Player]>(
        [0, Player.NONE],
        ([index, result]) => [N.increment(index), result === Player.NONE ? columnWinner(board, index) : result]
    )(board[0])
    if (tempVerticalWinner !== Player.NONE) return tempVerticalWinner

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

const getNewStateWrapper = (newBoard: BoardState, state: GameState, coordinates: Coordinates) =>
    getNewState(newBoard, updateWinner(changeAtCoordinates(state.turn, coordinates, state.board)), state, coordinates)

const getNewState = (newBoard: BoardState, winnerUpdatedBoard: BoardState | undefined, state: GameState, coordinates: Coordinates) => ({
    winner: newBoard && winnerUpdatedBoard ? winnerUpdatedBoard.winner : state.winner, // Check winners of InnerStates
    turn: newBoard ? state.turn === Player.X ? Player.O : Player.X : state.turn,
    board: newBoard && winnerUpdatedBoard ? updatePlayable(Opt.toUndefined(A.last(coordinates.data))!, winnerUpdatedBoard, !isBoardAtCoordinatesFull({data: [Opt.toUndefined(A.last(coordinates.data))!]}, state)) : state.board
})

export function updateState(coordinates: Coordinates, state: GameState): GameState {
    return getNewStateWrapper(changeAtCoordinates(state.turn, coordinates, state.board), state, coordinates)
}

export default startState;
