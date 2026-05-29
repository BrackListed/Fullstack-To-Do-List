import { Left } from "../Components/Left";

interface CompletedProps{
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

export function Completed({setToggleSignIn, setToggleSignUp}: CompletedProps){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/70 backdrop-blur-sm">
            <Left
            setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
        </div>
    )
}