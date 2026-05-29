import { useEffect, useState } from "react"
import axios from "axios";
import { SignIn, SignUp } from "@clerk/react";

axios.defaults.withCredentials = true

interface taskType{
    content: string
    id: number;
    done: boolean
}

interface MainProps {
    toggleSignIn: boolean;
    toggleSignUp: boolean;
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

export function Main({toggleSignIn, toggleSignUp, setToggleSignIn, setToggleSignUp}: MainProps){
    const [tasks, setTask] = useState<taskType[]>([])
    const [inputValue, setInputValue] = useState("")
    useEffect(() => {
      const fetchExpressData = async() => {
        const response = await axios.get("http://localhost:3000/data", {withCredentials: true})
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
        <div className="w-full h-full flex-1">
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
            <div className="bg-zinc-600 w-10/12 min-h-11/12 h-fit rounded-lg p-3 gap-3 text-zinc-50 font-sans my-4">
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