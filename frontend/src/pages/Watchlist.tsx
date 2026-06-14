import { Left } from "../Components/Left"

interface WatchlistProps{
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

export function Watchlist({setToggleSignIn, setToggleSignUp}: WatchlistProps){
    return(
        <div className="flex w-screen h-screen">
            <Left
            setToggleSignIn = {setToggleSignIn}
            setToggleSignUp = {setToggleSignUp}
            ></Left>
            <div className="flex-1 flex"></div>
        </div>
    )
}