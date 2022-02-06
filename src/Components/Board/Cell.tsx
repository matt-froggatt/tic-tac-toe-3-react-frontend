import * as R from 'ramda'
import React from "react";
import {noOp} from "../../Helpers/FunctionalUtilities";

interface CellProps {
    onClickWhenPlayable: () => void
    children: React.ReactNode
    isPlayable: boolean
}

const Cell: React.FC<CellProps> = ({onClickWhenPlayable, children, isPlayable}) =>
    <button
        className={"w-12 h-12 flex items-center justify-center " + R.ifElse(R.always(isPlayable), R.always("cursor-pointer"), R.always("cursor-not-allowed"))()}
        type="button"
        onClick={R.ifElse(R.always(isPlayable), onClickWhenPlayable, noOp)}
    >
        {children}
    </button>

export default Cell;
