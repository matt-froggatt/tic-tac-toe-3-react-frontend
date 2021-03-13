import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";
import Modal from "./Modal";
import StyledModal from "./StyledModal";

interface WinnerProps {
    winner: Player
}

const Winner: React.FC<WinnerProps> = ({winner}) =>
    winner !== Player.NONE ?
        <StyledModal>
            <div className='flex flex-row items-center'>
                <div className='w-6 h-6'>
                    <IconFromPlayer player={winner}/>
                </div>
                <p className='font-bold'> has won!</p>
            </div>
        </StyledModal>
        : null

export default Winner