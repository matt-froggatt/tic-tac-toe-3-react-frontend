import * as f from 'fp-ts/function'
import * as F from 'fp-ts-std/Function'
import React from "react";

interface SelectBoxProps {
    children: React.ReactNode
    isSelected: boolean
}

const SelectBox: React.FC<SelectBoxProps> = ({children, isSelected}) =>
    <div className={F.ifElse<boolean, string>(f.constant("bg-green-200 border-4 border-green-800 rounded-2xl p-1"))(f.constant("p-2"))(f.identity)(isSelected)}>
        {children}
    </div>

export default SelectBox
