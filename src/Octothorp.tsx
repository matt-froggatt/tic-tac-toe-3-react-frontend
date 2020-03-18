import React from "react";
import Cell from "./Cell";
import { styled } from "linaria/react";
import DataProps from "./Props";

const StyledTable = styled.table`
	border-collapse: collapse;

	td {
		border: solid black 5px;
		color: black;
		text-align: center;
	}
`;

function Octothorp(props: DataProps<any>) {
	return (
		<StyledTable>
			<tbody>
				{props.data.map((row: string[], i: number) => {
					return (
						<tr key={i}>
							{row.map((column: string, j: number) => {
								return (
									<td key={j}>
										<Cell
											data={column}
											updateData={() =>
												props.updateData(j, i)
											}
										/>
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</StyledTable>
	);
}

export default Octothorp;
