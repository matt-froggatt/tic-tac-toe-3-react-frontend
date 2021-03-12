import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";

interface CurrentPlayerProps {
    currentPlayer: Player
}

const CurrentPlayer: React.FC<CurrentPlayerProps> = ({ currentPlayer }) =>
    <div className='flex flex-row items-center'>
        <p className='font-bold'>Turn: </p>
        <div className='w-6 h-6'>
            <IconFromPlayer player={currentPlayer}/>
        </div>
    </div>

export default CurrentPlayer