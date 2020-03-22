import React from "react";
import { styled } from "linaria/react";
import DataProps from "../Props";

const StyledTable = styled.table`
	border-collapse: collapse;
`;

const StyledData = styled.td`
	border: solid black 5px;
	color: black;
	text-align: center;
`;

function Octothorp(props: { data: any[][] }) {
	return (
		<StyledTable>
			<tbody>
				{props.data.map((x, ind1) => (
					<tr>
						{x.map((y, ind2) => (
							<StyledData key={"" + ind1 + ind2}>{y}</StyledData>
						))}
					</tr>
				))}
			</tbody>
		</StyledTable>
	);
}

export default Octothorp;
