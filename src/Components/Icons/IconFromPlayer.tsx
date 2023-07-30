import React from "react";
import IconX from "./IconX";
import IconO from "./IconO";
import {eqPlayer, Player} from "../../gameRules";
import * as f from "fp-ts/function";
import * as F from 'fp-ts-std/Function'
import * as m from "monocle-ts";

interface IconFromTextProps {
    player: Player
}

const playerInPropsEquals = (player: Player) => (props: IconFromTextProps): boolean => eqPlayer.equals(player, m.Lens.fromProp<IconFromTextProps>()("player").get(props))

const PLAYER: keyof IconFromTextProps = 'player'
// TODO figure out alternative for propEq
const IconFromPlayer: React.FC<IconFromTextProps> = F.guard<IconFromTextProps, React.ReactElement | null>([
    [playerInPropsEquals(Player.O), f.constant(<IconO/>)],
    [playerInPropsEquals(Player.X), f.constant(<IconX/>)]
])(f.constant(null))

export default IconFromPlayer