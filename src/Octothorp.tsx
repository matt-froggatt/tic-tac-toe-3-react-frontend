import React from "react";
import Cell from "./Cell";
import "./Octothorp.css";

interface Props {
  data: string[][];
  updateData: any;
}

function Octothorp(props: Props) {
  return (
    <table className="Octothorp">
      <tbody>
        {props.data.map((row: string[], i) => {
          return (
            <tr key={i}>
              {row.map((column: string, j) => {
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
