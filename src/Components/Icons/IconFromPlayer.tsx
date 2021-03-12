import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";
import {Player} from "../../gameRules";

interface IconFromTextProps {
    player: Player
}

const IconMap = new Map([[Player.X, <IconX colour="blue-500"/>], [Player.O, <IconO colour="red-500" />]])

const IconFromPlayer: React.FC<IconFromTextProps> = ({player}) => {
    return IconMap.get(player) || null
}

export default IconFromPlayer