import React, { useEffect, useState } from "react";
import startState, {
    BoardState,
    Coordinates,
    createEmptyCoordinates,
    getBoardFromState,
    Player,
    GameState,
    updateStateFromMoveMessage,
    getGameWinner,
    updateStateFromMove
} from "../gameRules";
import Board from "./Board/Board";
import CurrentPlayer from "./Board/CurrentPlayer";
import WinnerModal from "./WinnerModal";
import IdModal from "./IdModal";
import * as f from "fp-ts/lib/function";
import * as wsfns from "../Helpers/FunctionalWebSockets";
import * as utils from "../Helpers/FunctionalUtilities"
import * as Opt from 'fp-ts/lib/Option'
import * as m from 'monocle-ts'
import * as F from "fp-ts-std/Function";
import * as T from "fp-ts/Tuple"



const URL = window.location.hostname + ":8080"

const socket = wsfns.create(URL)

const useBoard = (): [BoardState, Player, Player, (id: Opt.Option<number>) => (c: Coordinates) => void, () => void, (moveMessage: wsfns.MoveMessage) => void] => {
    const [state, setState] = useState<GameState>(startState)
    console.log("Function definition...", JSON.stringify(state))
    return [
        getBoardFromState(state),
        getGameWinner(state),
        state.turn,
        (id) => (coordinates: Coordinates) => {            
            console.log("About to send message...", JSON.stringify(state))
            Opt.map((p1id) => wsfns.send(JSON.stringify({ "command": wsfns.RequestCommand.MakeMove, "id": p1id, "coordinates": coordinates, "player": state.turn }))(socket))(id)
            setState(prevState => updateStateFromMove({
                player: state.turn,
                coordinates: coordinates
            }, prevState))
        },
        () => setState(startState),
        (m) => {
            console.log("Updating...", JSON.stringify(state))
            setState(prevState => updateStateFromMoveMessage(m, prevState))
        }
    ]
}

const connectToWebSocket: (setId: (id: Opt.Option<number>) => void, setGameStarted: (game: boolean) => void, updateBoardFromMessage: (m: wsfns.MoveMessage) => void) => (ws: WebSocket) => WebSocket = (setId, setGameStarted, updateBoardFromMoveMessage) => f.flow(
    utils.log("Attempting Connection..."),
    wsfns.onOpen(
        f.flow(
            utils.log("Successfully Connected"),
            T.mapFst(wsfns.send(JSON.stringify({ "command": wsfns.RequestCommand.RequestId }))),
        )
    ),
    wsfns.onMessage(
        T.mapSnd(
            f.flow(
                m.Lens.fromProp<MessageEvent>()('data').get,
                utils.logValue,
                JSON.parse,
                (r) => r as wsfns.GameMessage,
                F.guard<wsfns.GameMessage, any>([
                    [wsfns.isCommandOfType(wsfns.ResponseCommand.SetId), f.flow(m.Lens.fromProp<wsfns.GameMessage>()('id').get, Opt.fromNullable, setId)],
                    [wsfns.isCommandOfType(wsfns.ResponseCommand.JoinGameFailed), () => console.log("Join Game Failed")],
                    [wsfns.isCommandOfType(wsfns.ResponseCommand.JoinGameSucceeded), () => setGameStarted(true)],
                    [wsfns.isCommandOfType(wsfns.ResponseCommand.UpdateBoardFromMove), f.flow((m) => m as wsfns.MoveMessage, updateBoardFromMoveMessage)],
                ])(utils.logAndTransformData((data) => "Unrecognized command: " + JSON.stringify(data)))
            )
        )
    ),
    wsfns.onClose(
        f.flow(
            utils.logAndTransformData(([, event]: [WebSocket, CloseEvent]) => `Socket Closed Connection: ${event}`),
            T.mapFst(wsfns.send("Client Closed!"))
        )
    ),
    wsfns.onError((error: any) => utils.logAndTransformData(() => `Socket Error: ${error}`))
)

const coordinates = createEmptyCoordinates()

function App() {
    const [id, setId] = useState<Opt.Option<number>>(Opt.none)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [board, winner, turn, generatePlayAtCoordinates, playAgain, updateBoardFromMoveMessage] = useBoard()

    const playAtCoordinates = generatePlayAtCoordinates(id)

    useEffect(() => {
        connectToWebSocket(setId, setGameStarted, updateBoardFromMoveMessage)(socket)
    }, [])

    return (
        <div className="flex flex-row items-center justify-center w-screen h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <Board
                    state={board}
                    coordinates={coordinates}
                    updateState={playAtCoordinates}
                />
                <CurrentPlayer currentPlayer={turn} />
            </div>
            <IdModal id={id} onP2IdSubmit={
                Opt.map(
                    (p2Id) =>
                        Opt.map((p1id) => {
                            wsfns.send(JSON.stringify({
                                command: wsfns.RequestCommand.JoinGame,
                                p2Id: p2Id,
                                id: p1id
                            }))(socket)
                        }
                        )(id)
                )
            } gameStarted={gameStarted} />
            <WinnerModal winner={winner} onPlayAgain={playAgain} />
        </div>
    );
}

export default App;