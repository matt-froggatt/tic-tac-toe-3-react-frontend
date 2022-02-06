import * as R from 'ramda'
import React from "react";
import SelectBox from "./SelectBox";
import {mapIndexed} from "../../Helpers/FunctionalUtilities";

interface TableProps {
    children: any[]
    isPlayable: boolean
    isParentPlayable: boolean
}

const Table: React.FC<TableProps> = ({children, isPlayable, isParentPlayable}) =>
        <div className="p-2">
            <SelectBox isSelected={R.and(isPlayable, R.not(isParentPlayable))}>
                <table className="border-collapse">
                    <tbody>
                    {mapIndexed(
                        (i, outerItem: any) =>
                            <tr className="border-t-4 border-black border-solid first:border-none" key={"table-row-" + i}>
                                {mapIndexed(
                                    (j, innerItem: any) => (
                                        <td
                                            className="border-l-4 border-black border-solid first:border-none"
                                            key={"table-item-" + j}
                                        >
                                            {innerItem}
                                        </td>
                                    ),
                                    outerItem
                                )}
                            </tr>,
                        children
                    )}
                    </tbody>
                </table>
            </SelectBox>
        </div>

export default Table;
