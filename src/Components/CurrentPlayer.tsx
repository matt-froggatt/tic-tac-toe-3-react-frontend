import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";

interface CurrentPlayerProps {
    currentPlayer: Player
}

const CurrentPlayer: React.FC<CurrentPlayerProps> = ({ currentPlayer }) =>
    <div className='flex flex-row items-center'>
        <p className='text-3xl'>You are: </p>
        <div className='w-12 h-12'>
            <IconFromPlayer player={currentPlayer}/>
        </div>
    </div>

export default CurrentPlayer