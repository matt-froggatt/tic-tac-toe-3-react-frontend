import React, { useState } from "react";
import Octothorp from "./Octothorp";
import "./App.css";

function App() {
  const [state, setState] = useState({
    turn: "X",
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]
  });

  return (
    <div className="App">
      <Octothorp
        data={state.board}
        updateData={(x: number, y: number) =>
          setState({
            turn: state.turn === "X" ? "O" : "X",
            board: state.board.map((row: string[], i) =>
              row.map((column: string, j) =>
                state.board[i][j] === "" && i === y && j === x
                  ? state.turn
                  : state.board[i][j]
              )
            )
          })
        }
      />
    </div>
  );
}

export default App;
