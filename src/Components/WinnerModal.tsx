import * as R from 'ramda'
import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";
import Modal from "./Library/Modal";
import GoodButton from "./Library/GoodButton";

interface WinnerProps {
    winner: Player
    onPlayAgain: () => void
}

const WINNER: keyof WinnerProps = 'winner'

const WinnerModal: React.FC<WinnerProps> =
    R.ifElse(
        R.propEq(WINNER, Player.NONE),
        R.always(null),
        ({winner, onPlayAgain}: WinnerProps) => (
            <Modal>
                <div className='flex flex-col items-center'>
                    <div className='flex flex-row items-center justify-center pb-2'>
                        <div className='w-6 h-6'>
                            <IconFromPlayer player={winner}/>
                        </div>
                        <p className='font-bold text-xl'> has won!</p>
                    </div>
                    <GoodButton onClick={onPlayAgain}>Play again?</GoodButton>
                </div>
            </Modal>
        )
    )

export default WinnerModal