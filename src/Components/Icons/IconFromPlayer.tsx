import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";
import {Player} from "../../gameRules";

interface IconFromTextProps {
    player: Player
}

const IconMap = new Map([[Player.X, <IconX/>], [Player.O, <IconO/>]])

const IconFromPlayer: React.FC<IconFromTextProps> = ({player}) => {
    return IconMap.get(player) || null
}

export default IconFromPlayer