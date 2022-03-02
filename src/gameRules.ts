import * as B from 'fp-ts-std/Boolean'
import * as b from 'fp-ts/boolean'
import * as s from 'fp-ts/string'
import * as A from 'fp-ts/Array'
import * as F from 'fp-ts-std/Function'
import * as f from 'fp-ts/function'
import * as Opt from 'fp-ts/Option'
import * as n from 'fp-ts/number'
import * as N from 'fp-ts-std/Number'
import * as Eq from 'fp-ts/Eq'
import * as Eit from 'fp-ts/Either'

// TODO add eslint
export enum Player {
    X = "X",
    O = "O",
    NONE = ""
}

export interface BoardState {
    winner: Player
    isPlayable: boolean
    containedItems: Eit.Either<BoardState[][], Player[][]>
}

type Coordinate = {
    x: number
    y: number
}

const eqCoordinate: Eq.Eq<Coordinate> = {
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

const eqPlayer: Eq.Eq<Player> = {
    equals: (player1, player2) => player1 === player2
}

const eqBoardState: Eq.Eq<BoardState> = {
    equals: (bs1, bs2) => A.every<boolean>(f.identity)([
        eqPlayer.equals(bs1.winner, bs2.winner),
        b.Eq.equals(bs1.isPlayable, bs2.isPlayable),
        eqBoardStateContained.equals(bs1.containedItems, bs2.containedItems)
    ])
}

const eqBoardStateContained = Eit.getEq(A.getEq(A.getEq(eqBoardState)), A.getEq(A.getEq(eqPlayer)))

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

export const getBoardInfo = (state: BoardState): Eit.Either<BoardState[][], Player[][]> => state.containedItems

export const getBoardInfoAs2dArray = (state: BoardState): Eit.Either<BoardState, Player>[][] => A.map(eitherOfArrayToArrayOfEither)(eitherOfArrayToArrayOfEither(getBoardInfo(state)))

const generate2dArrayOf = <T>(itemCreator: () => T, width: number, height: number): T[][] => A.makeBy(height, () => A.makeBy(width, itemCreator))

const generateStartInnerBoard = (levels = 2, width = 3, height = 3): BoardState => ({
    winner: Player.NONE,
    isPlayable: true,
    containedItems: levels === 1 ?
        Eit.right(generate2dArrayOf(f.constant(Player.NONE), width, height)) :
        Eit.left(generate2dArrayOf(f.constant(generateStartInnerBoard(levels - 1, width, height)), width, height))
})

const generateStartState = (levels = 2, width = 3, height = 3): GameState => ({
        winner: Player.NONE,
        turn: Player.X,
        board: generateStartInnerBoard(levels, width, height)
    }
)

const startState = generateStartState()

const changeAtIndex = <T>(array: T[], value: T, index: number): T[] => Opt.getOrElse<T[]>(f.constant([]))(A.updateAt(index, value)(array))

const coordinatesFromArray = (array: Coordinate[]): Coordinates => ({data: array})

const changeAtCoordinates = (value: Player, coordinates: Coordinates, board: BoardState): BoardState => ({
    winner: board.winner,
    isPlayable: board.isPlayable,
    containedItems:
        Eit.match<BoardState[][], Player[][], Eit.Either<BoardState[][], Player[][]>>(
            arr => Eit.left(changeAtIndex(
                arr,
                changeAtIndex(arr[Opt.toUndefined(A.head(coordinates.data))!.x],
                    changeAtCoordinates(value, coordinatesFromArray(Opt.toUndefined(A.tail(coordinates.data))!),
                        arr[Opt.toUndefined(A.head(coordinates.data))!.x][Opt.toUndefined(A.head(coordinates.data))!.y]),
                    Opt.toUndefined(A.head(coordinates.data))!.y),
                Opt.toUndefined(A.head(coordinates.data))!.x)),
            arr => Eit.right(changeAtIndex(
                arr,
                changeAtIndex(arr[Opt.toUndefined(A.head(coordinates.data))!.x], value, Opt.toUndefined(A.head(coordinates.data))!.y),
                Opt.toUndefined(A.head(coordinates.data))!.x)
            )
        )(board.containedItems)
})

const firstCoordinate = (coordinates: Coordinates): Opt.Option<Coordinate> => A.head(coordinates.data)

const restCoordinates = (coordinates: Coordinates): Opt.Option<Coordinates> =>
    Opt.map<Coordinate[], Coordinates>(a => ({data: a}))(A.tail(coordinates.data))

const isAnyEmpty: (squares: Player[][]) => boolean = A.some<Player[]>(A.some<Player>(player => eqPlayer.equals(Player.NONE, player)))

const isBoardFull = (board: BoardState): boolean => Eit.match<BoardState[][], Player[][], boolean>(
    arr => A.reduce<BoardState[], boolean>(
        false as boolean,
        (value, item) =>
            value ||
            A.reduce<BoardState, boolean>(
                false as boolean,
                (value, item) =>
                    value || isBoardFull(item))(item))(
        arr
    ),
    arr => isAnyEmpty(arr)
)(board.containedItems)

const getBoardAtCoordinatesWrapped = (
    firstCoord: Opt.Option<Coordinate>,
    restCoords: Opt.Option<Coordinates>,
    board: BoardState
): BoardState =>
    Eit.match<BoardState[][], Player[][], BoardState>(
        b => Opt.match<Coordinate, BoardState>(
            f.constant(board),
            first => getBoardAtCoordinatesWrapped(
                Opt.chain(firstCoordinate)(restCoords),
                Opt.chain(restCoordinates)(restCoords),
                b[first.x][first.y]
            )
        )(firstCoord),
        f.constant(board)
    )(getBoardInfo(board))
// coordinates === EmptyCoordinates || !isArrayOfBoardArray(board.containedItems) ?
// board :
// getBoardAtCoordinates(restCoordinates(coordinates), board.containedItems[firstCoordinate(coordinates).x][firstCoordinate(coordinates).y])

const getBoardAtCoordinates = (coordinates: Coordinates, board: BoardState):
    BoardState => getBoardAtCoordinatesWrapped(firstCoordinate(coordinates), restCoordinates(coordinates), board)

const isBoardAtCoordinatesFull = (coordinates: Coordinates, state: GameState): boolean =>
    isBoardFull(getBoardAtCoordinates(coordinates, getBoardFromState(state)))

const updatePlayable = (playableCoordinate: Coordinate, board: BoardState, isParentPlayable = false, currentCoordinates: Coordinates = EmptyCoordinates): BoardState => ({
    winner: board.winner,
    isPlayable: isParentPlayable || (firstCoordinate(currentCoordinates) && Opt.getEq(eqCoordinate).equals(Opt.some(playableCoordinate), firstCoordinate(currentCoordinates))),
    containedItems: Eit.match<BoardState[][], Player[][], Eit.Either<BoardState[][], Player[][]>>(
        arr => Eit.left(arr.map(
            (array, x) =>
                array.map(
                    (item, y) =>
                        updatePlayable(
                            playableCoordinate,
                            item,
                            isParentPlayable || (firstCoordinate(currentCoordinates) && Opt.getEq(eqCoordinate).equals(Opt.some(playableCoordinate), firstCoordinate(currentCoordinates))),
                            updateCoordinates(currentCoordinates, x, y))
                )
        )),
        Eit.right
    )(board.containedItems)
})

const getWinnerOfCell = Eit.match<BoardState, Player, Player>((item) =>
    winnerOfBoard(item.containedItems), (item) => item)

// TODO extract and combine duplicated logic where possible
const columnWinner = (board: Eit.Either<BoardState[][], Player[][]>, column: number): Player =>
    Opt.getOrElse<Player>(f.constant(Player.NONE))(A.reduce<Eit.Either<BoardState, Player>[], Opt.Option<Player>>(
        Opt.none,
        (prevWinner, currentRow) =>
            F.unless<Opt.Option<Player>>(
                (currentWinner) =>
                    B.or(Opt.isNone(prevWinner))(Opt.getEq(eqPlayer).equals(currentWinner, prevWinner))
            )(f.constant(Opt.some(Player.NONE)))(Opt.some(getWinnerOfCell(currentRow[column])))
    )(
        Eit.match<BoardState[][], Player[][], Eit.Either<BoardState, Player>[][]>(
            left => A.map(A.map(Eit.left))(left), right => A.map(A.map(Eit.right))(right)
        )(board)
    ))

const rowWinner = (board: Eit.Either<BoardState[][], Player[][]>, row: number): Player =>
    Opt.getOrElse(f.constant(Player.NONE))(A.reduce<Eit.Either<BoardState, Player>, Opt.Option<Player>>(
            Opt.none,
            (prevWinner, currentRow) =>
                F.unless<Opt.Option<Player>>(
                    (currentWinner) =>
                        B.or(Opt.isNone(prevWinner))(Opt.getEq(eqPlayer).equals(currentWinner, prevWinner))
                )(f.constant(Opt.some(Player.NONE)))(Opt.some(getWinnerOfCell(currentRow)))
        )(
            Eit.match<BoardState[][], Player[][], Eit.Either<BoardState, Player>[]>(
                left => A.map(Eit.left)(left[row]), right => A.map(Eit.right)(right[row])
            )(board)
        )
    )

const getDiagonalArray = <T>(array: T[][], isAntiDiagonal: boolean = false): T[] => A.flatten(
    A.mapWithIndex<T[], T[]>(
        (i, a) => A.filterMapWithIndex<T, T>(
            (j, item) => n.Eq.equals(i, j) ? Opt.some(item) : Opt.none
        )(
            F.ifElse<T[], T[]>(A.reverse)(f.identity)(f.constant(isAntiDiagonal))(a)
        )
    )(array)
)

const eitherOfArrayToArrayOfEither = <T, U>(either: Eit.Either<T[], U[]>): Eit.Either<T, U>[] =>
    Eit.match<T[], U[], Eit.Either<T, U>[]>(
        left => A.map(Eit.left)(left), right => A.map(Eit.right)(right)
    )(either)

const arrayWinner = (arr: Eit.Either<BoardState, Player>[]): Player =>
    Opt.match<Eit.Either<BoardState, Player>, Player>(
        f.constant(Player.NONE),
        item => f.flow<[Eit.Either<BoardState, Player>], Player, Player>(
            getWinnerOfCell,
            F.ifElse<Player, Player>(
                f.identity
            )(
                f.constant(Player.NONE)
            )(
                potentialWinner =>
                    A.every<Eit.Either<BoardState, Player>>(
                        cell => eqPlayer.equals(getWinnerOfCell(cell), potentialWinner)
                    )(arr)
            )
        )(item)
    )(A.head(arr))

const antiDiagonalWinner = (board: Eit.Either<BoardState[][], Player[][]>): Player =>
    diagonalWinner(board, true)

const diagonalWinner = (board: Eit.Either<BoardState[][], Player[][]>, isAntiDiagonal: boolean = false): Player =>
    arrayWinner(getDiagonalArray(A.map(eitherOfArrayToArrayOfEither)(eitherOfArrayToArrayOfEither(board)), isAntiDiagonal))


function winnerOfBoard(board: Eit.Either<BoardState[][], Player[][]>): Player {
    const [, tempHorizontalWinner] = A.reduce<Eit.Either<BoardState[], Player[]>, [number, Player]>(
        [0, Player.NONE],
        ([index, result]) => [N.increment(index), result === Player.NONE ? rowWinner(board, index) : result]
    )(eitherOfArrayToArrayOfEither(board))
    if (tempHorizontalWinner !== Player.NONE) return tempHorizontalWinner


    const [, tempVerticalWinner] = A.reduce<Eit.Either<BoardState, Player>, [number, Player]>(
        [0, Player.NONE],
        ([index, result]) => [N.increment(index), result === Player.NONE ? columnWinner(board, index) : result]
    )(eitherOfArrayToArrayOfEither(eitherOfArrayToArrayOfEither(board)[0]))
    if (tempVerticalWinner !== Player.NONE) return tempVerticalWinner

    const tempDiagonalWinner = diagonalWinner(board)
    if (tempDiagonalWinner !== Player.NONE) return tempDiagonalWinner

    const tempAntiDiagonalWinner = antiDiagonalWinner(board)
    if (tempAntiDiagonalWinner !== Player.NONE) return tempAntiDiagonalWinner

    return Player.NONE
}

const updateWinnerWrapped = (board: BoardState, containedItemsUpdated: f.Lazy<Eit.Either<BoardState[][], Player[][]>>): BoardState =>
    (board.winner === Player.NONE) ? ({
            ...board,
            winner: winnerOfBoard(containedItemsUpdated()),
            containedItems: containedItemsUpdated()
        }) :
        board

const updateWinner = (board: BoardState): BoardState => updateWinnerWrapped(
    board,
    f.constant(
        Eit.match <BoardState[][], Player[][], Eit.Either<BoardState[][], Player[][]>>(
            (b) => Eit.left<BoardState[][], Player[][]>(
                b.map(array => array.map(item => updateWinner(item)))
            ),
            (Eit.right)
        )(board.containedItems)
    )
)

const getNewStateWrapper = (newBoard: BoardState, state: GameState, coordinates: Coordinates) =>
    getNewState(newBoard, updateWinner(changeAtCoordinates(state.turn, coordinates, state.board)), state, coordinates)

const getNewState = (newBoard: BoardState, winnerUpdatedBoard: BoardState | undefined, state: GameState, coordinates: Coordinates) => ({
    winner: newBoard && winnerUpdatedBoard ? winnerUpdatedBoard.winner : state.winner,
    turn: newBoard ? state.turn === Player.X ? Player.O : Player.X : state.turn,
    board: newBoard && winnerUpdatedBoard ? updatePlayable(Opt.toUndefined(A.last(coordinates.data))!, winnerUpdatedBoard, !isBoardAtCoordinatesFull({data: [Opt.toUndefined(A.last(coordinates.data))!]}, state)) : state.board
})

export const updateState = (coordinates: Coordinates, state: GameState): GameState =>
    getNewStateWrapper(changeAtCoordinates(state.turn, coordinates, state.board), state, coordinates)

export default startState;
