import React from "react";

interface StyledButtonProps {
    children: any
    color: string
    hoverColor: string
    activeColor: string
    onClick: () => void
}

const StyledButton: React.FC<StyledButtonProps> = ({children, color, hoverColor, activeColor, onClick}) =>
    <button
        className={`rounded text-white p-1 bg-${color} hover:bg-${hoverColor} active:bg-${activeColor}`}
        onClick={onClick}
    >
        {children}
    </button>

export default StyledButton