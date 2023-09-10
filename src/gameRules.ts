import * as B from 'fp-ts-std/Boolean'
import * as b from 'fp-ts/boolean'
import * as s from 'fp-ts/string'
import * as A from 'fp-ts/Array'
import * as Arr from 'fp-ts-std/Array'
import * as F from 'fp-ts-std/Function'
import * as f from 'fp-ts/function'
import * as Opt from 'fp-ts/Option'
import * as n from 'fp-ts/number'
import * as Eq from 'fp-ts/Eq'
import * as Eit from 'fp-ts/Either'
import * as P from 'fp-ts/Predicate'
import * as wsfns from './Helpers/FunctionalWebSockets'
import * as utils from './Helpers/FunctionalUtilities'


/**
 * Type Definitions
 */

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

export type Coordinates = Coordinate[]

interface Move {
    player: Player
    coordinates: Coordinates
}

export interface GameState {
    turn: Player
    board: BoardState
}


/**
 * Generic Helper Functions
 */

const generate2dArrayOf = <T>(itemCreator: () => T, width: number, height: number): T[][] => A.makeBy(height, () => A.makeBy(width, itemCreator))

const getDiagonalArray = (isAntiDiagonal: boolean) => <T>(array: T[][]): T[] => A.flatten(
    A.mapWithIndex<T[], T[]>(
        (i, a) => A.filterMapWithIndex<T, T>(
            (j, item) => n.Eq.equals(i, j) ? Opt.some(item) : Opt.none
        )(
            F.ifElse<T[], T[]>(A.reverse)(f.identity)(f.constant(isAntiDiagonal))(a)
        )
    )(array)
)

const getDiagonalArrays = <T>(array: T[][]): T[][] => [getDiagonalArray(false)(array), getDiagonalArray(true)(array)]

const updateAtCoordinate = <T>(coordinate: Coordinate, fn: (val: T) => T) => (matrix: T[][]): T[][] => f.pipe(
    Opt.Do,
    Opt.bind('row', f.constant(A.lookup(coordinate.x, matrix))),
    Opt.bind('item', ({ row }) => A.lookup(coordinate.y, row)),
    Opt.chain(({ row, item }) =>
        f.pipe(
            A.updateAt(coordinate.y, fn(item))(row),
            Opt.chain((updatedRow) =>
                A.updateAt(coordinate.x, updatedRow)(matrix) // Update the entire matrix
            )
        )),
    Opt.getOrElse(f.constant(matrix))
)

const twoDimensionEvery = <T>(predicate: P.Predicate<T>) => (array: T[][]) => f.pipe(array, A.flatten, A.every(predicate))

const allItemsEqual = <T>(equal: Eq.Eq<T>) => (array: T[]) =>
    f.pipe(
        A.head(array),
        Opt.match(
            f.constFalse,
            f.flow(
                F.curry2(equal.equals),
                F.flip(A.every)(array)
            )
        )
    )

/**
 * Equality Constants
 */

export const eqPlayer: Eq.Eq<Player> = {
    equals: (player1, player2) => player1 === player2
}

const eqPlayerNotNone: Eq.Eq<Player> = {
    equals: (player1, player2) => B.and(eqPlayer.equals(player1, player2))(isPlayerNotNone(player1))
}

const eqBoardState: Eq.Eq<BoardState> = {
    equals: (bs1, bs2) => A.every<boolean>(f.identity)([
        eqPlayer.equals(bs1.winner, bs2.winner),
        b.Eq.equals(bs1.isPlayable, bs2.isPlayable),
        eqBoardStateContained.equals(bs1.containedItems, bs2.containedItems)
    ])
}

const eqBoardStateContained = Eit.getEq(A.getEq(A.getEq(eqBoardState)), A.getEq(A.getEq(eqPlayer)))

const eqCoordinate: Eq.Eq<Coordinate> = {
    equals: (c1, c2) => B.and(n.Eq.equals(c1.x, c2.x))(n.Eq.equals(c1.y, c2.y))
}

const eqCoorinates: Eq.Eq<Coordinates> = {
    equals: (cs1: Coordinates, cs2: Coordinates) => A.getEq(eqCoordinate).equals(cs1, cs2)
}

/**
 * Getter Functions
 */

export const getGameWinner = (state: GameState) => state.board.winner

const getFirstCoordinate = (coordinates: Coordinates) => A.head(coordinates)

const getRestCoordinates = (coordinates: Coordinates) => A.tail(coordinates)

const getNoPlayer = f.constant<Player>(Player.NONE)

const getBoardWinner = (board: BoardState) => board.winner

export const getBoardFromState = (state: GameState): BoardState => state.board

export const getBoardContents = (state: BoardState): Eit.Either<BoardState[][], Player[][]> => state.containedItems

const getBoardAtCoordinatesWrapped = (
    firstCoord: Opt.Option<Coordinate>,
    restCoords: Opt.Option<Coordinates>,
    board: BoardState
): BoardState =>
    Eit.match<BoardState[][], Player[][], BoardState>(
        b => Opt.match<Coordinate, BoardState>(
            f.constant(board),
            first => getBoardAtCoordinatesWrapped(
                Opt.chain(A.head)(restCoords),
                Opt.chain(A.tail)(restCoords),
                b[first.x][first.y]
            )
        )(firstCoord),
        f.constant(board)
    )(getBoardContents(board))

const getBoardAtCoordinates = (coordinates: Coordinates) => (board: BoardState):
    BoardState => getBoardAtCoordinatesWrapped(A.head(coordinates), A.tail(coordinates), board)

/**
 * Init Functions
 */

export const createEmptyCoordinates = () => (EmptyCoordinates)

const createCoorinatesFromCoordinate = (coordinate: Coordinate) => updateCoordinates(createEmptyCoordinates(), coordinate)

export const createCoordinate = (x: number, y: number): Coordinate => ({ x, y })

const generateStartInnerBoard = (levels = 2, width = 3, height = 3): BoardState => ({
    winner: Player.NONE,
    isPlayable: true,
    containedItems: levels === 1 ?
        Eit.right(generate2dArrayOf(getNoPlayer, width, height)) :
        Eit.left(generate2dArrayOf(f.constant(generateStartInnerBoard(levels - 1, width, height)), width, height))
})

const generateStartState = (levels = 2, width = 3, height = 3): GameState => ({
    turn: Player.X,
    board: generateStartInnerBoard(levels, width, height)
})

/**
 * Useful Constants
 */

const EmptyCoordinates: Coordinates = [];

const startState = generateStartState()


/**
 * Predicate Functions
 */

export const isBoard = (state: any): state is BoardState => B.invert(s.Eq.equals(typeof state, "string"))

const isPlayerNone = F.curry2(eqPlayer.equals)(Player.NONE)
const isPlayerNotNone = f.flow(isPlayerNone, B.invert)

const doesBoardHaveWinner = f.flow(getBoardWinner, isPlayerNone, B.invert)

const isBoardFull = (board: BoardState): boolean => f.pipe(
    getBoardContents(board),
    Eit.match(
        twoDimensionEvery(isBoardFull),
        twoDimensionEvery(isPlayerNotNone)
    )
)

const isBoardAtCoordinatesFull = (coordinates: Coordinates, state: GameState): boolean =>f.pipe(
    getBoardFromState(state),
    getBoardAtCoordinates(coordinates),
    isBoardFull
)

/**
 * Update functions
 */

const switchPlayer = (p: Player) => eqPlayer.equals(p, Player.X) ? Player.O : Player.X

export const updateCoordinates = (coordinates: Coordinates, additionalCoordinate: Coordinate): Coordinates => A.append(additionalCoordinate)(coordinates)

const newUpdateBoardWithMove = (move: Move) => (board: BoardState): BoardState => f.pipe(
    Opt.Do,
    Opt.bind('head', f.constant(getFirstCoordinate(move.coordinates))),
    Opt.bind('tail', f.constant(getRestCoordinates(move.coordinates))),
    Opt.map(
        ({ head, tail }) => ({
            winner: board.winner,
            isPlayable: board.isPlayable,
            containedItems:
                Eit.bimap(
                    updateAtCoordinate(
                        head,
                        newUpdateBoardWithMove({ player: move.player, coordinates: tail })
                    ),
                    updateAtCoordinate(head, f.constant(move.player))
                )(board.containedItems)
        })
    ),
    Opt.getOrElse(f.constant(board))
)

const updatePlayable = (
    playableCoordinate: Coordinates,
    board: BoardState,
    isParentPlayable = false,
    currentCoordinates: Coordinates = EmptyCoordinates,
    isThisBoardPlayable = B.or(isParentPlayable)(
        eqCoorinates.equals(
            playableCoordinate, currentCoordinates
        )
    )): BoardState => ({
        winner: board.winner,
        isPlayable: isThisBoardPlayable,
        containedItems: Eit.mapLeft<BoardState[][], BoardState[][]>(
            A.mapWithIndex<BoardState[], BoardState[]>(
                (x, array) =>
                    A.mapWithIndex<BoardState, BoardState>(
                        (y, item) =>
                            updatePlayable(
                                playableCoordinate,
                                item,
                                isThisBoardPlayable,
                                updateCoordinates(currentCoordinates, createCoordinate(x, y)))
                    )(array)
            )
        )(board.containedItems)
    })

const calculateHorizontalWinnerOfPlayerBoard =
    f.flow(
        A.map<Player[], Opt.Option<Player>>(
            F.guard<Player[], Opt.Option<Player>>(
                [[allItemsEqual(eqPlayerNotNone), A.head]]
            )(f.constant(Opt.none)),
        ),
        A.compact,
        A.head,
        Opt.getOrElse(getNoPlayer)
    )

const getCalculateWinnerFunction = (modifyBoardContents: <A>(boardContents: A[][]) => A[][]) => (boardContents: Eit.Either<BoardState[][], Player[][]>): Player =>
    Eit.match<BoardState[][], Player[][], Player>(
        f.flow(
            modifyBoardContents,
            A.map(A.map(f.flow(getBoardContents, getCalculateWinnerFunction(modifyBoardContents)))),
            calculateHorizontalWinnerOfPlayerBoard
        ),
        f.flow(modifyBoardContents, calculateHorizontalWinnerOfPlayerBoard)
    )(boardContents)

const calculateHorizontalWinner = getCalculateWinnerFunction(f.identity)

const calculateVerticalWinner = getCalculateWinnerFunction(Arr.transpose)

const calculateDiagonalWinner = getCalculateWinnerFunction(getDiagonalArrays)

const winnerOfBoard = (board: BoardState): Player =>
    F.guard([[doesBoardHaveWinner, getBoardWinner]])(
        (board) =>
            f.pipe(
                [
                    calculateHorizontalWinner,
                    calculateVerticalWinner,
                    calculateDiagonalWinner
                ],
                A.flap(getBoardContents(board)),
                A.filter(isPlayerNotNone),
                A.head,
                Opt.getOrElse<Player>(getNoPlayer)
            )
    )(board)

const newUpdateWinner: (board: BoardState) => BoardState = F.when(
    f.flow(
        getBoardWinner,
        isPlayerNone
    )
)(
    (board: BoardState) => ({
        ...board,
        winner: winnerOfBoard(board),
        containedItems: f.pipe(
            getBoardContents(board),
            Eit.mapLeft(A.map(A.map(newUpdateWinner)))
        )
    })
)

const updateState = (winnerUpdatedBoard: BoardState, state: GameState, move: Move) => ({
    turn: switchPlayer(move.player),
    board: f.pipe(
        A.last(move.coordinates),
        Opt.map((lastCoord) =>
            updatePlayable(createCoorinatesFromCoordinate(lastCoord), winnerUpdatedBoard, isBoardAtCoordinatesFull(createCoorinatesFromCoordinate(lastCoord), state))
        ),
        Opt.getOrElse(f.constant(state.board))
    )
})


export const updateStateFromMove = (m: Move, s: GameState) =>
    updateState(newUpdateWinner(newUpdateBoardWithMove(m)(s.board)), s, m)

export const updateStateFromMoveMessage = (g: wsfns.MoveMessage, state: GameState): GameState =>
    f.pipe(updateStateFromMove(g, state), utils.logAndTransformData(JSON.stringify), utils.log(JSON.stringify(g)))

export default startState;
