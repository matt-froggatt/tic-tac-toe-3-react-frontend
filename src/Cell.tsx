import React from "react";
import "./Cell.css";

function Cell(props: any) {
  return (
    <button className="Cell" onClick={props.updateData}>
      {props.data}
    </button>
  );
}

export default Cell;
