import React from "react";

interface CellProps {
    onClickWhenPlayable: any
	children: any
	isPlayable: boolean
}

const Cell: React.FC<CellProps> = ({onClickWhenPlayable, children, isPlayable}) => {
	const onClick = isPlayable? onClickWhenPlayable : () => {}
	return (
		<button className={"w-12 h-12 flex items-center justify-center " + (isPlayable? "cursor-pointer" : "cursor-not-allowed")} type="button" onClick={onClick}>
			{children}
		</button>
	);
}

export default Cell;
