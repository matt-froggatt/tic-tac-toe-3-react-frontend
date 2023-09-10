import { BoardState, Coordinates, createCoordinate, getBoardContents, Player, updateCoordinates } from "../../gameRules";
import Table from "./Table";
import React from "react";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
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
        {
            E.match<BoardState[][], Player[][], JSX.Element[][]>(
                A.mapWithIndex<BoardState[], JSX.Element[]>((i, outerItem: BoardState[]) =>
                    A.mapWithIndex<BoardState, JSX.Element>((j, innerItem: BoardState) => <GenTable
                        state={innerItem}
                        coordinates={updateCoordinates(coordinates, createCoordinate(i, j))}
                        updateState={updateState}
                        isParentPlayable={state.isPlayable}
                    />
                    )(outerItem)
                ),
                A.mapWithIndex((i, outerItem: Player[]) =>
                    A.mapWithIndex((j, innerItem: Player) => <Cell
                        key={"1" + i + j}
                        onClickWhenPlayable={() => updateState(updateCoordinates(coordinates, createCoordinate(i, j)))}
                        isPlayable={state.isPlayable}
                    >
                        <IconFromPlayer player={innerItem} />
                    </Cell>
                    )(outerItem)
                )
            )(getBoardContents(state))
        }
    </Table>

export default GenTable