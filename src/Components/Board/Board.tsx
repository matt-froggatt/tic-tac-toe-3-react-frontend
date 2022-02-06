import GenTable from "./GenTable";
import {Coordinates, BoardState} from "../../gameRules";
import React from "react";

interface BoardProps {
    state: BoardState
    coordinates: Coordinates
    updateState: (c: Coordinates) => void
}

const Board: React.FC<BoardProps> = (
    {
        state,
        coordinates,
        updateState
    }: BoardProps) =>
    <div className="border-4 border-yellow-900 rounded-2xl bg-yellow-100">
        <GenTable state={state} coordinates={coordinates} updateState={updateState}/>
    </div>

export default Board;