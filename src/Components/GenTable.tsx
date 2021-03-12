import {Coordinates, getBoardInfo, InnerState, isBoard, updateCoordinates} from "../gameRules";
import Table from "./Table";
import Cell from "./Cell";
import React from "react";
import IconFromText from "./Icons/IconFromPlayer";

interface GenTableProps {
    state: InnerState
    coordinates: Coordinates
    updateState: any
    isParentPlayable?: boolean
}

const GenTable: React.FC<GenTableProps> = (
    {
        state,
        coordinates,
        updateState,
        isParentPlayable = false
    }
) =>
    <Table isPlayable={state.isPlayable} isParentPlayable={isParentPlayable}>{
        getBoardInfo(state).map((outer: any, i: number) =>
            outer.map((inner: any, j: number) =>
                isBoard(inner) ? (
                    <GenTable state={inner} coordinates={updateCoordinates(coordinates, i, j)}
                              updateState={updateState} isParentPlayable={state.isPlayable}/>
                ) : (
                    <Cell
                        key={"1" + i + j}
                        onClickWhenPlayable={() => updateState(updateCoordinates(coordinates, i, j))}
                        isPlayable={state.isPlayable}
                    >
                        <IconFromText player={inner} />
                    </Cell>
                )
            )
        )}
    </Table>

export default GenTable