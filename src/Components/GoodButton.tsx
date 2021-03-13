import React from "react";
import StyledButton from "./StyledButton";

interface GoodButtonProps {
    children: any
    onClick: () => void
}

const GoodButton: React.FC<GoodButtonProps> = ({ children, onClick }) =>
    <StyledButton
        onClick={onClick}
        color="green-500"
        hoverColor="green-600"
        activeColor="green-800"
    >
        {children}
    </StyledButton>

export default GoodButton