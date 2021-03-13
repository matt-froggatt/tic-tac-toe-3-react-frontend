import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";
import Modal from "./Modal";
import StyledModal from "./StyledModal";

interface WinnerProps {
    winner: Player
    onPlayAgain: () => void
}

const Winner: React.FC<WinnerProps> = ({winner, onPlayAgain}) =>
    winner !== Player.NONE ?
        <StyledModal>
            <div className='flex flex-col items-center'>
                <div className='flex flex-row items-center justify-center pb-2'>
                    <div className='w-6 h-6'>
                        <IconFromPlayer player={winner}/>
                    </div>
                    <p className='font-bold'> has won!</p>
                </div>
                <button
                    className='bg-green-500 rounded text-white hover:text-white p-1 hover:bg-green-600 active:bg-green-800'
                    onClick={onPlayAgain}>Play again? ↻
                </button>
            </div>
        </StyledModal>
        : null

export default Winner