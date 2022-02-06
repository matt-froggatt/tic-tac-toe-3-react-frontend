import React, {useEffect, useState} from "react"
import * as R from 'ramda'
import Modal from "./Library/Modal";
import GoodButton from "./Library/GoodButton";

interface IDModalProps {
    id?: number
    onIdSubmit: (id?: number) => void
    gameStarted: boolean
}

const IdModal: React.FC<IDModalProps> = ({id, onIdSubmit, gameStarted}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [enteredValue, setEnteredValue] = useState<number>()

    useEffect(() => R.pipe(R.isNil, setIsLoading)(id), [id])

    return R.ifElse(
        R.always(gameStarted),
        R.always(null),
        ({id, onIdSubmit}: IDModalProps) => (
            <Modal>
                <div className="flex flex-col">
                    <div className="pb-2">
                        <p>Your ID is {isLoading ? 'loading...' : id}</p>
                        <p>Enter a friend's ID below to play!</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <input
                            className='border-b-2 border-black w-3/4'
                            placeholder="Enter friend's ID here"
                            type="number"
                            onChange={R.pipe(R.pathOr('err', ['target', 'value']), parseInt, setEnteredValue)}
                        />
                        <GoodButton onClick={() => onIdSubmit(enteredValue)}>Go!</GoodButton>
                    </div>
                </div>
            </Modal>
        )
    )({id, onIdSubmit, gameStarted})
}

export default IdModal