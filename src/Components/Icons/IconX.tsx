import IconInterface from './IconInterface';
import React from "react";

const IconX: React.FC<IconInterface> = ({colour}) => <p className={"flex-grow text-" + colour}>X</p>

export default IconX
