import * as R from 'ramda'
import React from "react";

interface SelectBoxProps {
    children: any
    isSelected: boolean
}

const SelectBox: React.FC<SelectBoxProps> = ({children, isSelected}) =>
    <div className={R.ifElse(R.always(isSelected), R.always("bg-green-200 border-4 border-green-800 rounded-2xl p-1"), R.always("p-2"))()}>
        {children}
    </div>

export default SelectBox
