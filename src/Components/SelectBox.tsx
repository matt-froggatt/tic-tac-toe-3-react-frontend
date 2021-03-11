import React from "react";

interface SelectBoxProps {
    children: any
    isSelected: boolean
}

const SelectBox: React.FC<SelectBoxProps> = ({children, isSelected}) =>
    <div className={isSelected? "bg-green-200 border-4 border-green-800 rounded-2xl p-1": "p-2"}>
        {children}
    </div>

export default SelectBox
