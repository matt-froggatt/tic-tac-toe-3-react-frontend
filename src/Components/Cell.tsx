import React from "react";
import { styled } from "linaria/react";

const BasicButton = styled.button`
	width: 50px;
	height: 50px;

	:hover {
		cursor: pointer;
	}
`;

function Cell(props: any) {
	return (
		<BasicButton type="button" onClick={props.updateData}>
			{props.data}
		</BasicButton>
	);
}

export default Cell;