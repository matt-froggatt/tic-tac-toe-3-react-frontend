import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";
import {Player} from "../../gameRules";
import * as R from "ramda";

interface IconFromTextProps {
    player: Player
}

const PLAYER: keyof IconFromTextProps = 'player'

const IconFromPlayer: React.FC<IconFromTextProps> = R.cond([
    [R.propEq(PLAYER, Player.O), R.always(<IconO/>)],
    [R.propEq(PLAYER, Player.X), R.always(<IconX/>)],
    [R.T, R.always(null)]
])

export default IconFromPlayer