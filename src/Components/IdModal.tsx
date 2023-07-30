import React, {ChangeEvent, useEffect, useState} from "react"
import Modal from "./Library/Modal";
import GoodButton from "./Library/GoodButton";
import * as f from "fp-ts/function";
import * as Opt from 'fp-ts/Option'
import * as m from "monocle-ts";


interface IDModalProps {
    id: Opt.Option<number>
    onIdSubmit: (id: Opt.Option<number>) => void
    gameStarted: boolean
}

const IdModal: React.FC<IDModalProps> = ({ id, onIdSubmit, gameStarted}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [enteredValue, setEnteredValue] = useState<Opt.Option<number>>(Opt.none)

    useEffect(() => f.pipe(id, Opt.isNone, setIsLoading), [id])

    return gameStarted ? (
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
                            onChange={f.flow((e) => m.Optional.fromPath<ChangeEvent<HTMLInputElement>>()(['target', 'value']).getOption(e), Opt.map(parseInt), setEnteredValue)}
                        />
                        <GoodButton onClick={() => onIdSubmit(enteredValue)}>Go!</GoodButton>
                    </div>
                </div>
            </Modal>
        ) : null
}

export default IdModal