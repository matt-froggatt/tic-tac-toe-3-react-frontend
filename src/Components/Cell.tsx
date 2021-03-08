import React from "react";

function Cell(props: any) {
	return (
		<button className="w-16 h-16" type="button" onClick={props.updateState}>
			{props.children}
		</button>
	);
}

export default Cell;
