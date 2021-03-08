import React, {ReactElement} from "react";

function Table(props: any): ReactElement {
	return (
		<table className="border-collapse m-3">
			<tbody>
				{props.children.map((outer: any, i: number) => (
					<tr className="border-t-4 border-black border-solid first:border-none" key={"table-row-" + i}>
						{outer.map((inner: any, j: number) => (
							<td className="border-l-4 border-black border-solid first:border-none flex-shrink" key={"table-item-" + i + j}>{inner}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Table;
