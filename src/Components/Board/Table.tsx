import * as B from 'fp-ts-std/Boolean'
import * as A from "fp-ts/Array";
import React, {ReactNode} from "react";
import SelectBox from "./SelectBox";

interface TableProps {
    children: React.ReactNode[][]
    isPlayable: boolean
    isParentPlayable: boolean
}

const Table: React.FC<TableProps> = ({children, isPlayable, isParentPlayable}) =>
        <div className="p-2">
            <SelectBox isSelected={B.and(isPlayable)(B.invert(isParentPlayable))}>
                <table className="border-collapse">
                    <tbody>
                    {A.mapWithIndex<React.ReactNode[], React.ReactNode>(
                        (i, outerItem) =>
                            <tr className="border-t-4 border-black border-solid first:border-none" key={"table-row-" + i}>
                                {A.mapWithIndex(
                                    (j, innerItem: ReactNode) => (
                                        <td
                                            className="border-l-4 border-black border-solid first:border-none"
                                            key={"table-item-" + j}
                                        >
                                            {innerItem}
                                        </td>
                                    ))(
                                    outerItem
                                )}
                            </tr>)(
                        children
                    )}
                    </tbody>
                </table>
            </SelectBox>
        </div>

export default Table;
