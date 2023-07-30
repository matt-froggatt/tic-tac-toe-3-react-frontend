import * as f from 'fp-ts/function'
import * as F from 'fp-ts-std/Function'
import * as m from 'monocle-ts'
import React from "react";
import {eqPlayer, Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";
import Modal from "./Library/Modal";
import GoodButton from "./Library/GoodButton";

interface WinnerProps {
    winner: Player
    onPlayAgain: () => void
}

const WINNER: keyof WinnerProps = 'winner'

const WinnerModal: React.FC<WinnerProps> =
    F.ifElse<WinnerProps, React.ReactElement | null>(
        f.constant(null)
    )(
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
    )(
        f.flow(
            m.Lens.fromProp<WinnerProps>()(WINNER).get,
            prop => eqPlayer.equals(Player.NONE, prop)
        )
    )

export default WinnerModal