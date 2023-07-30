import React from "react"

interface StyledModalProps {
    children: React.ReactNode
}

const Modal: React.FC<StyledModalProps> = ({children}) =>
    <div className='fixed inset-0 w-screen h-screen'>
        <div className="flex justify-center items-center w-full h-full backdrop-blur">
            <div className="rounded-2xl bg-white border-4 border-white-900 p-4">
                {children}
            </div>
        </div>
    </div>

export default Modal