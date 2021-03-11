import React from "react";
import SelectBox from "./SelectBox";

interface TableProps {
    children: any[]
    isPlayable: boolean
    isParentPlayable: boolean
}

const Table: React.FC<TableProps> = ({children, isPlayable, isParentPlayable}) => {
    return (
        <div className="p-2">
            <SelectBox isSelected={isPlayable && !isParentPlayable}>
                <table className="border-collapse">
                    <tbody>
                    {children.map((outer: any, i: number) => (
                        <tr className="border-t-4 border-black border-solid first:border-none" key={"table-row-" + i}>
                            {outer.map((inner: any, j: number) => (
                                <td className="border-l-4 border-black border-solid first:border-none"
                                    key={"table-item-" + i + j}>{inner}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </SelectBox>
        </div>
    );
}

export default Table;
