import React, { ReactElement } from "react";
import Cell from "./Cell";
import { styled } from "linaria/react";
import DataProps from "../Props";

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

function Table(props: DataProps<any>): ReactElement {
	return (
		<StyledTable playable={false}>
			<tbody>
				{props.data.board.map((outerRow: string[][][], i: number) => (
					<tr key={i}>
						{outerRow.map((outerColumn: string[][], j: number) => (
							<StyledTd key={j}>
								<StyledTable
									key={j}
									playable={
										(i === props.data.lastPlayed[1] &&
											j === props.data.lastPlayed[0]) ||
										(props.data.lastPlayed[0] === -1 &&
											props.data.lastPlayed[1] === -1)
									}
								>
									<tbody key={j}>
										{outerColumn.map(
											(row: string[], k: number) => (
												<tr key={k}>
													{row.map(
														(
															column: string,
															l: number
														) => (
															<StyledTd key={l}>
																<Cell
																	key={l}
																	data={
																		column
																	}
																	updateData={() =>
																		props.updateData(
																			j,
																			i,
																			l,
																			k
																		)
																	}
																/>
															</StyledTd>
														)
													)}
												</tr>
											)
										)}
									</tbody>
								</StyledTable>
							</StyledTd>
						))}
					</tr>
				))}
			</tbody>
		</StyledTable>
	);
}

export default Table;
