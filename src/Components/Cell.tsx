import React from "react";

function Cell(props: any) {
	return (
		<button className="w-20 h-20 flex items-center justify-center" type="button" onClick={props.updateState}>
			{props.children}
		</button>
	);
}

export default Cell;
