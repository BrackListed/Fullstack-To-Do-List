import { useAuth, UserButton, useUser } from "@clerk/react"
import { Home, ListChecks } from "lucide-react"
import { Link } from "react-router-dom"

interface LeftProps{
    setToggleSignIn: (value: boolean) => void;
    setToggleSignUp: (value: boolean) => void;
}

export function Left({setToggleSignIn, setToggleSignUp}: LeftProps){
    const {isSignedIn} = useAuth()
    const { user } = useUser()
    return(
        <div id = "left-hand-side" className="flex flex-col gap-3 bg-gray-300 h-full w-1/4">
            <div id = "header" className="flex p-3 gap-2 h-20 center my-5">
                {isSignedIn === false && <button onClick = {() => setToggleSignIn(true)}className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 flex-1 rounded transition-colors">Sign In</button>}
                {isSignedIn === false && <button onClick = {() => setToggleSignUp(true)}className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium py-2 px-4 flex-1 rounded transition-colors">Sign Up</button>}
                {isSignedIn && <div className="flex gap-2 items-center justify-start">
                    <UserButton appearance={{ elements: { avatarBox: { width: "80px", height: "80px" } } }} />
                    {!useUser && <span className="text-2xl font-semibold">SIMPLE TO DO LIST</span>}
                    <span className="flex-1 w-full text-2xl font-semibold">Welcome, {user?.firstName}</span>
                </div>}
            </div>
            <div id = "panels" className="flex-col gap-3 p-3 full w-full">
                <Link to = "/"><div className="flex text-2xl text-center hover:bg-gray-200 rounded-lg hover:cursor-pointer hover:p-1 hover:scale-105 transition-all items-center h-fit gap-3"><Home className="text-2xl"/><span>Home</span></div></Link>
                <Link to = "/Completed"><div className="flex text-2xl text-center hover:bg-gray-200 my-5 rounded-lg hover:cursor-pointer hover:p-1 hover:scale-105 transition-all items-center h-fit gap-3"><ListChecks className="text-2xl"/><span>Tasks Done</span></div></Link>
            </div>
        </div>
    )
}