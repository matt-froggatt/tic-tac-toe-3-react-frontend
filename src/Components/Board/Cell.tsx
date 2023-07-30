import * as f from 'fp-ts/function'
import * as F from 'fp-ts-std/Function'
import React from "react";
import {noOp} from "../../Helpers/FunctionalUtilities";

interface CellProps {
    onClickWhenPlayable: () => void
    children: React.ReactNode
    isPlayable: boolean
}

const Cell: React.FC<CellProps> = ({onClickWhenPlayable, children, isPlayable}) =>
    <button
        className={"w-12 h-12 flex items-center justify-center " + F.ifElse<boolean, string>(f.constant("cursor-pointer"))(f.constant("cursor-not-allowed"))(f.identity)(isPlayable)}
        type="button"
        onClick={F.ifElse(onClickWhenPlayable)(noOp)(f.constant(isPlayable))}
    >
        {children}
    </button>

export default Cell;
