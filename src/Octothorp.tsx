import React from "react";
import Cell from "./Cell";
import DataProps from "./Props";
import "./Octothorp.css";

function Octothorp(props: DataProps<any>) {
  return (
    <table className="Octothorp">
      <tbody>
        {props.data.map((row: string[], i: number) => {
          return (
            <tr key={i}>
              {row.map((column: string, j: number) => {
                return (
                  <td key={j}>
                    <Cell
                      data={column}
                      updateData={() => props.updateData(j, i)}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Octothorp;
