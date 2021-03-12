import React from "react";
import {Player} from "../gameRules";
import IconFromPlayer from "./Icons/IconFromPlayer";

interface WinnerProps {
    winner: Player
}

const Winner: React.FC<WinnerProps> = ({winner}) =>
    winner !== Player.NONE ?
        <div>
            <IconFromPlayer player={winner}/>
            <p> has won!</p>
        </div>
        : null

export default Winner