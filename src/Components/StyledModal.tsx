import React from "react"
import Modal from "./Modal";

interface StyledModalProps {
    children: any
}

const StyledModal: React.FC<StyledModalProps> = ({children}) =>
    <Modal>
        <div className="flex justify-center items-center w-full h-full backdrop-blur">
            <div className="rounded bg-white p-4">
                {children}
            </div>
        </div>
    </Modal>

export default StyledModal