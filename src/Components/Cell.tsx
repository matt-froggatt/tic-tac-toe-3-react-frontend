import React from "react";
import { styled } from "linaria/react";

const BasicButton = styled.button`
	border: none;
	background: none;
	outline: 0;
	min-width: 50px;
	min-height: 50px;

	:hover {
		cursor: pointer;
	}

	:focus {
		outline: 0;
	}

	/* Get rid of Firefox dotted outline on button. */
	::-moz-focus-inner {
		border: 0;
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
