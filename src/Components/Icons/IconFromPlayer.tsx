import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";
import {Player} from "../../gameRules";
import {Colour} from "./IconInterface";

interface IconFromTextProps {
    player: Player
}

const IconMap = new Map([[Player.X, <IconX colour={Colour.BLUE}/>], [Player.O, <IconO colour={Colour.RED}/>]])

const IconFromPlayer: React.FC<IconFromTextProps> = ({player}) => {
    return IconMap.get(player) || null
}

export default IconFromPlayer