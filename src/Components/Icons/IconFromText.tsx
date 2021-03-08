import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";

interface IconFromTextProps {
    text: string
}

const IconFromText: React.FC<IconFromTextProps> = ({text}) => {
    switch (text) {
        case "X":
            return <IconX colour="blue-500" />
        case "O":
            return <IconO colour="red-500" />
        default:
            return null
    }
}

export default IconFromText