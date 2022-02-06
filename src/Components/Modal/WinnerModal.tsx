import * as R from 'ramda'
import React from "react";
import {Player} from "../../gameRules";
import IconFromPlayer from "../Icons/IconFromPlayer";
import StyledModal from "./StyledModal";
import GoodButton from "../Library/GoodButton";

interface WinnerProps {
    winner: Player
    onPlayAgain: () => void
}

const WinnerModal: React.FC<WinnerProps> =
    R.ifElse(
        R.propEq('winner', Player.NONE),
        R.always(null),
        ({winner, onPlayAgain}: WinnerProps) => (
            <StyledModal>
                <div className='flex flex-col items-center'>
                    <div className='flex flex-row items-center justify-center pb-2'>
                        <div className='w-6 h-6'>
                            <IconFromPlayer player={winner}/>
                        </div>
                        <p className='font-bold text-xl'> has won!</p>
                    </div>
                    <GoodButton onClick={onPlayAgain}>Play again?</GoodButton>
                </div>
            </StyledModal>
        )
    )

export default WinnerModal