import React from "react"
import IconInfo from "./Icons/IconInfo";
import IconHelp from "./Icons/IconHelp";

interface ButtonIconProps {
    className?: string
}

interface TitleBarButtonProps {
    Icon: React.FC<ButtonIconProps>
    text: string
}

const TitleBarButton: React.FC<TitleBarButtonProps> = ({Icon, text}) =>
    <button className="text-center text-gray-500 decoration-2 transition-all hover:underline hover:text-gray-800 hover:scale-110 active:scale-90 flex flex-row p-2"><Icon className="mr-1" />{text}</button>

export const TitleBar = () => <div className="fixed w-screen h-32 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center">Ultimate Tic-Tac-Toe</h1>
    <nav className="w-3/4 flex flex-row justify-between">
        <TitleBarButton Icon={IconInfo} text="About" />
        <TitleBarButton Icon={IconHelp} text="Rules" />
    </nav>
</div>
