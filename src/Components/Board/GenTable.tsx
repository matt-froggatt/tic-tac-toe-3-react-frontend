import {Coordinates, getBoardInfo, BoardState, isBoard, updateCoordinates} from "../../gameRules";
import Table from "./Table";
import Cell from "./Cell";
import React from "react";
import IconFromText from "../Icons/IconFromPlayer";
import {mapIndexed} from "../../Helpers/FunctionalUtilities";
import * as R from "ramda";

interface GenTableProps {
    state: BoardState
    coordinates: Coordinates
    updateState: (c: Coordinates) => void
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
    <Table isPlayable={state.isPlayable} isParentPlayable={isParentPlayable}>
        {mapIndexed((i: number, outerItem: any) =>
                mapIndexed((j: number, innerItem: any) =>
                        R.ifElse(
                            isBoard,
                            R.always(
                                <GenTable
                                    state={innerItem}
                                    coordinates={updateCoordinates(coordinates, i, j)}
                                    updateState={updateState}
                                    isParentPlayable={state.isPlayable}
                                />
                            ),
                            R.always(
                                <Cell
                                    key={"1" + i + j}
                                    onClickWhenPlayable={() => updateState(updateCoordinates(coordinates, i, j))}
                                    isPlayable={state.isPlayable}
                                >
                                    <IconFromText player={innerItem}/>
                                </Cell>
                            )
                        )(innerItem),
                    outerItem
                ),
            getBoardInfo(state)
        )}
    </Table>

export default GenTable