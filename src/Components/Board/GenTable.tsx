import {
    Coordinates,
    BoardState,
    updateCoordinates,
    getBoardInfoAs2dArray, Player
} from "../../gameRules";
import Table from "./Table";
import Cell from "./Cell";
import React from "react";
import IconFromText from "../Icons/IconFromPlayer";
import {mapIndexed} from "../../Helpers/FunctionalUtilities";
import * as E from "fp-ts/Either";

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
        {mapIndexed((i, outerItem) =>
                mapIndexed((j, innerItem) =>
                        E.match<BoardState, Player, JSX.Element>(
                            bs => <GenTable
                                state={bs}
                                coordinates={updateCoordinates(coordinates, i, j)}
                                updateState={updateState}
                                isParentPlayable={state.isPlayable}
                            />,
                            pl => <Cell
                                key={"1" + i + j}
                                onClickWhenPlayable={() => updateState(updateCoordinates(coordinates, i, j))}
                                isPlayable={state.isPlayable}
                            >
                                <IconFromText player={pl}/>
                            </Cell>
                        )(innerItem),
                    outerItem
                ),
            getBoardInfoAs2dArray(state)
        )}
    </Table>

export default GenTable