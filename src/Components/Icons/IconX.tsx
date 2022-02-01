import React from "react";

const bottom = 25
const top = 75
const strokeWidth = 10

const IconX: React.FC = () =>
    <svg width="100%" height="100%" viewBox="0 0 100 100" className={`stroke-current text-blue-500`}>
        <line x1={bottom} y1={bottom} x2={top} y2={top} strokeWidth={strokeWidth} strokeLinecap="round"/>
        <line x1={bottom} y1={top} x2={top} y2={bottom} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>

export default IconX
