import React from "react";

interface GoodButtonProps {
    children: any
    onClick: () => void
}

const GoodButton: React.FC<GoodButtonProps> = ({children, onClick}) =>
    <button
        className={`rounded text-white p-1 bg-green-500 hover:bg-green-600 active:bg-green-800`}
        onClick={onClick}
    >
        {children}
    </button>

export default GoodButton