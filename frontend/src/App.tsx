import { useEffect, useState } from "react"
import axios from "axios";
import { ListChecks } from 'lucide-react';
import { Link } from "react-router-dom";
import { SignIn, SignUp, useAuth, UserButton } from "@clerk/react";



interface taskType{
    content: string
    id: number;
    done: boolean
}
export default function App(){
    const [tasks, setTask] = useState<taskType[]>([])
    const [inputValue, setInputValue] = useState("")
    const [toggleSignIn, setToggleSignIn] = useState(false)
    const [toggleSignUp, setToggleSignUp] = useState(false)
    const {isSignedIn} = useAuth()

    useEffect(() => {
      const fetchExpressData = async() => {
        const response = await axios.get("http://localhost:3000/data")
        setTask(response.data)
    }
      fetchExpressData()
    }, [])

    useEffect(() => {
      const fetchExpressData = async() => {
        const response = await axios.get("http://localhost:3000/data")
        setTask(response.data)
      }
    
      fetchExpressData()
    }, [tasks])
    return(
        <div className="flex w-screen h-screen gap-30">
          {(toggleSignIn || toggleSignUp) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {toggleSignIn && <div className="relative flex w-screen h-screen items-center justify-center bg-black/60 backdrop-blur-sm">
                <button onClick={() => setToggleSignIn(false)}className="hover:cursor-pointer absolute top-4 right-4 z-10 text-xl font-sans font-bold text-zinc-400 hover:text-zinc-600 transition-colors">×</button>
                <SignIn/>
              </div>}
            {toggleSignUp && <div className="relative flex w-screen h-screen items-center justify-center bg-black/60 backdrop-blur-sm">
                <button onClick={() => setToggleSignUp(false)}className="hover:cursor-pointer  absolute top-4 right-4 z-10 text-xl font-sans font-bold text-zinc-400 hover:text-zinc-600 transition-colors">×</button>
                <SignUp/>
              </div>}
          </div>}
          <div id = "left-hand-side" className="flex flex-col gap-3 bg-gray-300 h-full w-1/4">
            <div id = "header" className="flex p-3 gap-2 h-20 center my-5">
              {isSignedIn === false && <button onClick = {() => setToggleSignIn(true)}className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 flex-1 rounded transition-colors">Sign In</button>}
              {isSignedIn === false && <button onClick = {() => setToggleSignUp(true)}className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-medium py-2 px-4 flex-1 rounded transition-colors">Sign Up</button>}
              {isSignedIn && <div className="flex gap-2 items-center justify-start">
                <UserButton appearance={{ elements: { avatarBox: { width: "80px", height: "80px" } } }} />
                <span className="text-2xl font-semibold">SIMPLE TO DO LIST</span>
                </div>}
            </div>
            <div id = "panels" className="flex-col gap-3 p-3 full w-full">
              <Link to = "/done"><div className="flex text-2xl text-center hover:bg-gray-200 rounded-lg hover:cursor-pointer hover:p-1 hover:scale-105 transition-all items-center h-fit gap-3"><ListChecks className="text-2xl"/><span>Tasks Done</span></div></Link>
            </div>
          </div>
            <div className="bg-zinc-600 w-7/12 min-h-11/12 h-fit rounded-lg p-3 gap-3 text-zinc-50 font-sans my-4">
            <div className="flex gap-3 w-full">
                <input value = {inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Insert task here..." className="flex-1 bg-zinc-800 w-full p-3 rounded-md min-h-10 max-h-fit focus-visible:ring-2 focus-visible:ring-violet-500 outline-none focus:scale-100.5 transition-all"></input>
                {inputValue && <button onClick = {async () => {await addTask(inputValue); setInputValue("")}}className="w-27 bg-purple-600 rounded-lg hover:brightness-90 p-3 font-bold hover: cursor-pointer hover:scale-105 transition-all ">ADD TASK</button>}
            </div>
                {tasks.map((task: taskType) => (
                    <div className="flex gap-3 items-center my-4">
                        <button className="w-30 text-zinc-50 text-center bg-purple-600 rounded-md p-3 hover:cursor-pointer hover:brightness-90 hover:scale-105 transition-all font-bold ">Mark as Done</button>
                        <div className="flex-1 text-zinc-50 bg-zinc-800 rounded-lg h-full p-5 text-2xl">{task.content}</div>
                        <button onClick = {() => deleteTask(task)}className="w-30 text-slate-950 bg-red-600 p-5 text-2xl text-center font-bold rounded-md hover: cursor-pointer hover:brightness-90 hover:scale-105 transition-all  ">DELETE</button>
                    </div>
                ))}
            </div>
        </div>
    )

    async function addTask(input: string){
        await axios.post("http://localhost:3000/data/", { content: input })
    }
    async function deleteTask(task: taskType){
        await axios.delete(`http://localhost:3000/data/${task.id}`)
    }
}