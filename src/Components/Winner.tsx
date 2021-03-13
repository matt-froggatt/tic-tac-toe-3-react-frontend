import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";

interface WinnerProps {
    winner: Player
}

const Winner: React.FC<WinnerProps> = ({winner}) =>
    winner !== Player.NONE ?
        <div className='flex flex-row items-center'>
            <div className='w-6 h-6'>
                <IconFromPlayer player={winner}/>
            </div>
            <p className='font-bold'> has won!</p>
        </div>
        : null

export default Winner