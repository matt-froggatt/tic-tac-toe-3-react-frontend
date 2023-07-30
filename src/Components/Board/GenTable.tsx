import {BoardState, Coordinates, getBoardInfoAs2dArray, Player, updateCoordinates} from "../../gameRules";
import Table from "./Table";
import React from "react";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as Eit from 'fp-ts/Either'
import Cell from "./Cell";
import IconFromPlayer from "../Icons/IconFromPlayer";

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
        {A.mapWithIndex((i, outerItem: Eit.Either<BoardState, Player>[]) =>
                A.mapWithIndex((j, innerItem: Eit.Either<BoardState, Player>) =>
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
                                <IconFromPlayer player={pl}/>
                            </Cell>
                        )(innerItem))(
                    outerItem
                ))(
            getBoardInfoAs2dArray(state)
        )}
    </Table>

export default GenTable