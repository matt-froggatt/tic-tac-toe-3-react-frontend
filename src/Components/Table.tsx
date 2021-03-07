import React, { ReactElement } from "react";
import { styled } from "linaria/react";

const StyledTable = styled.table`
	border-collapse: collapse;
	background-color: ${(props: { playable: boolean }) =>
		props.playable ? " green " : " none "};
`;

const StyledTd = styled.td`
	border: solid black 5px;
	color: black;
	text-align: center;
`;

function Table(props: any): ReactElement {
	return (
		<StyledTable playable={false}>
			<tbody>
				{props.children.map((outer: any, i: number) => (
					<tr key={"" + i}>
						{outer.map((inner: any, j: number) => (
							<StyledTd key={"" + i + j}>{inner}</StyledTd>
						))}
					</tr>
				))}
			</tbody>
		</StyledTable>
	);
}

export default Table;
