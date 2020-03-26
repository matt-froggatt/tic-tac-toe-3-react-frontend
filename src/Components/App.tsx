import React, { useState } from "react";
import { styled } from "linaria/react";
import Octothorp from "./Octothorp";
import startState, { updateState } from "../gameRules";

const CentredDiv = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const WinnerP = styled.p`
	margin: 10vh;
`;

function App() {
	const [state, setState] = useState(startState);

	return (
		<CentredDiv>
			<WinnerP>{state.winner} is win</WinnerP>
			<Octothorp
				data={state.board}
				updateData={(x: number, y: number) =>
					setState(updateState(x, y, state))
				}
			/>
		</CentredDiv>
	);
}

export default App;
