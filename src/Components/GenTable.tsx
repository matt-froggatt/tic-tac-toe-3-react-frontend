import {Coordinates, getBoardInfo, InnerState, isBoard, updateCoordinates} from "../gameRules";
import Table from "./Table";
import Cell from "./Cell";
import React from "react";

interface GenTableProps {
    state: InnerState
    coordinates: Coordinates
    updateState: Function
}

const GenTable: React.FC<GenTableProps> = (
    {
        state,
        coordinates,
        updateState
    }: GenTableProps
) =>
    <Table>{
        getBoardInfo(state).map((outer: any, i: number) =>
            outer.map((inner: any, j: number) =>
                isBoard(inner) ? (
                    <GenTable state={inner} coordinates={updateCoordinates(coordinates, i, j)}
                              updateState={updateState}/>
                ) : (
                    <Cell
                        key={"1" + i + j}
                        updateState={() => updateState(updateCoordinates(coordinates, i, j))}
                    >
                        {inner}
                    </Cell>
                )
            )
        )}
    </Table>

export default GenTable