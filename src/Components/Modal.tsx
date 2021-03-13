import React from "react";

interface ModalProps {
    children: any
}

const Modal: React.FC<ModalProps> = ({ children }) =>
    <div className='fixed inset-0 w-screen h-screen'>
        {children}
    </div>

export default Modal