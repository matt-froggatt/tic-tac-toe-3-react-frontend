import React, {useState} from "react"
import StyledModal from "./StyledModal";
import GoodButton from "./GoodButton";

interface IDModalProps {
    id: number
    onIdSubmit: (id?: number) => void
    gameStarted: boolean
}

const IdModal: React.FC<IDModalProps> = ({id, onIdSubmit, gameStarted}) => {
    const [enteredValue, setEnteredValue] = useState<number>()
    return (gameStarted ? null :
        <StyledModal>
            <div className="flex flex-col">
                <div className="pb-2">
                    <p>Your ID is {id}</p>
                    <p>Enter a friend's ID below to play!</p>
                </div>
                <div className="flex flex-row justify-between">
                    <input
                        className='border-b-2 border-black w-3/4'
                        placeholder="Enter friend's ID here"
                        type="number"
                        onChange={(e) => setEnteredValue(parseInt(e.target.value))}
                    />
                    <GoodButton onClick={() => onIdSubmit(enteredValue)}>Go!</GoodButton>
                </div>
            </div>
        </StyledModal>)
}

export default IdModal