import IconInterface from './IconInterface';
import React from "react";

const radius = 30

const IconO: React.FC<IconInterface> = ({colour}) =>
    <svg width="100%" height="100%" viewBox="0 0 100 100" className={`stroke-current text-${colour}`}>
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="10"/>
    </svg>

export default IconO
