import { ClerkProvider } from "@clerk/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";
import { Completed } from "./pages/Completed";
import { useState } from "react";
import { Left } from "./Components/Left";

export default function App(){
    const [toggleSignIn, setToggleSignIn] = useState(false)
    const [toggleSignUp, setToggleSignUp] = useState(false)
    return(
    <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <Routes>
      <Route path = "/" element = {<div className='flex w-screen h-screen gap-30'>
        <Left
        setToggleSignIn = {setToggleSignIn}
        setToggleSignUp = {setToggleSignUp}
        />
        <Main
        toggleSignIn = {toggleSignIn}
        toggleSignUp = {toggleSignUp}
        setToggleSignIn = {setToggleSignIn}
        setToggleSignUp = {setToggleSignUp}/>
        </div>}></Route>
      <Route path = "/Completed" element = {<div className='flex-1'><Completed
        setToggleSignIn = {setToggleSignIn}
        setToggleSignUp = {setToggleSignUp}
      /></div>}></Route>
    </Routes>
    </ClerkProvider>
    </BrowserRouter>
    )
}