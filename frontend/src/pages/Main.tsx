import { useEffect, useState } from "react"
import axios from "axios";
import { SignIn, SignUp } from "@clerk/react";
import { Check, Rotate3D, X } from "lucide-react";
import { API_URL } from "../api"
import { useAuth } from "@clerk/react";

axios.defaults.withCredentials = true

interface taskType{
    content: string
    id: string;
    done: boolean
}

interface MainProps {
    toggleSignIn: boolean;
    toggleSignUp: boolean;
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

export function Main({toggleSignIn, toggleSignUp, setToggleSignIn, setToggleSignUp}: MainProps){
    const { getToken } = useAuth()
    const [tasks, setTask] = useState<taskType[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isChanging, setIsChanging] = useState(false)
    const [newTaskValue, setnewTaskValue] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [hasAddedTask, sethasAddedTask] = useState(false)
    const [hasDeletedTask, sethasDeletedTask] = useState(false)
    const [hasUpdatedTask, setHasUpdatedTask] = useState(false)
    const [targetTask, setTargetTask] = useState<taskType>()
    useEffect(() => {
      const fetchExpressData = async() => {
        const token = await getToken()
        const response = await axios.get(`${API_URL}/data`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
        setTask(response.data)
    }
      fetchExpressData()
    }, [])

    useEffect(() => {
      const fetchExpressData = async() => {
        const token = await getToken()
        const response = await axios.get(`${API_URL}/data`, { headers: { Authorization: `Bearer ${token}`}})
        setTask(response.data)
        setIsLoading(false)
      }
      fetchExpressData()
    }, [tasks])
    

    useEffect(() => {
        if(hasAddedTask){
            setTimeout(() => {
                sethasAddedTask(false)
            }, 1000);
        }
    }, [hasAddedTask])

    useEffect(() => {
        if(hasUpdatedTask){
            setTimeout(() => {
                setHasUpdatedTask(false)
            }, 1000);
        }
    }, [hasUpdatedTask])

    useEffect(() => {
        if(hasDeletedTask){
            setTimeout(() => {
                sethasDeletedTask(false)
            }, 1000);
        }
    }, [hasDeletedTask])
    return(
        <div className="w-full h-full flex-1">
            {hasAddedTask && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><Check/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task added successfully!</span>
            </div>}
            {hasUpdatedTask && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-blue-950/90 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><Rotate3D/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task updated!</span>
            </div>}
            {hasDeletedTask && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-rose-950/90 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><X/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task deleted successfully!</span>
            </div>}
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
            {tasks.length <= 0 && <span className="text-2xl font-medium text-zinc-50 my-5 font-sans tracking-wide select-none m-auto block text-center">No tasks added yet! Click the input button above to get started!</span>}
            {(isLoading && tasks.length > 0) && <div className="flex flex-col items-center justify-center gap-3 m-auto py-8">
                <div className="w-6 h-6 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-zinc-400 font-sans tracking-wide animate-pulse select-none">Loading your tasks...</span>
            </div>}
                {tasks.map((task: taskType) => (
                    <div className="flex gap-3 items-center my-4">
                        <button onClick = {() => CompleteTask(task)}className="w-30 text-zinc-50 text-center bg-purple-600 rounded-md p-3 hover:cursor-pointer hover:brightness-90 hover:scale-105 transition-all font-bold ">Mark as Done</button>
                        {(isChanging === true && task.id === targetTask!.id) &&  <input onBlur = {() => {setIsChanging(false);if (newTaskValue.trim() !== "" && newTaskValue !== task.content) {updateTask(newTaskValue, task.id)}}}onKeyDown={(e) => {if(e.key === "Enter") {{setIsChanging(false);if(newTaskValue.trim() !== "" && newTaskValue !== task.content){updateTask(newTaskValue, task.id)}}}}} onChange={(e) => setnewTaskValue(e.target.value)} defaultValue = {task.content} className="flex-1 text-zinc-50 bg-zinc-800 rounded-lg h-full p-5 text-2xl outline-0 focus-visible:ring-2 focus-visible:ring-violet-500"></input>}
                        {isChanging === false && <div onClick={() => {setIsChanging(true); setTargetTask(task) }} className="hover: cursor-text flex-1 text-zinc-50 bg-zinc-800 rounded-lg h-full p-5 text-2xl">{task.content}</div>}
                        <button onClick = {() => deleteTask(task)}className="w-30 text-slate-950 bg-red-600 p-5 text-2xl text-center font-bold rounded-md hover: cursor-pointer hover:brightness-90 hover:scale-105 transition-all  ">DELETE</button>
                    </div>
                ))}
            </div>
        </div>
    )

    async function addTask(input: string){
        const token = await getToken()
        await axios.post(`${API_URL}/data/`, { content: input }, { headers: { Authorization: `Bearer ${token}`}})
        sethasAddedTask(true)
    }

    async function updateTask(taskContent: string, id: string){
        const token = await getToken()
        await axios.put(`${API_URL}/update/${id}`, { content: taskContent}, { headers: { Authorization: `Bearer ${token}`}})
        setHasUpdatedTask(true)
    }
    async function deleteTask(task: taskType){
        const token = await getToken()
        await axios.delete(`${API_URL}/data/${task.id}`, { headers: { Authorization: `Bearer ${token}`}})
        sethasDeletedTask(true)
    }

    async function CompleteTask(task: taskType){
        const token = await getToken()
        await axios.post(`${API_URL}/complete/${task.id}`, { id: task.id}, { headers: { Authorization: `Bearer ${token}`}})
    }
}