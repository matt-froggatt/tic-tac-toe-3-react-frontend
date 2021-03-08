import IconInterface from './IconInterface';
import React from "react";

const IconO: React.FC<IconInterface> = ({colour}) => <p className={"flex-grow text-" + colour}>O</p>

export default IconO
