import { useEffect, useState } from "react"
import axios from "axios";

interface taskType{
    name: string
    id: number;
    done: boolean
}
export function Tasks(){
    const [tasks, setTask] = useState<taskType[]>([])
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        const fetchExpressData = async() => {
        const response = await axios.get("http://localhost:3000/data")
        setTask(response.data)
    }
    
        fetchExpressData()
    }, [])

    return(
        <div className="flex w-screen h-screen items-center justify-center">
            <div className="bg-zinc-600 w-7/12 min-h-11/12 h-fit rounded-lg p-3 gap-3 text-zinc-50 font-sans">
            <div className="flex gap-3 w-full">
                <input onChange={(e) => setInputValue(e.target.value)} placeholder="Insert task here..." className="flex-1 bg-zinc-800 w-full p-3 rounded-md min-h-10 max-h-fit focus-visible:ring-2 focus-visible:ring-violet-500 outline-none focus:scale-100.5 transition-all"></input>
                {inputValue && <button onClick = {() => addTask(inputValue)}className="w-27 bg-purple-600 rounded-lg hover:brightness-90 p-3 font-bold hover: cursor-pointer hover:scale-105 transition-all ">ADD TASK</button>}
            </div>
                {tasks.map((task: taskType) => (
                    <div className="flex gap-3 items-center my-4">
                        <div className="w-25 text-zinc-50 text-center bg-purple-600 rounded-md p-5 text-3xl font-bold ">{task.id}</div>
                        <div className="flex-1 text-zinc-50 bg-zinc-800 rounded-lg h-full p-5 text-2xl">{task.name}</div>
                        <button onClick = {() => deleteTask(task)}className="w-30 text-slate-950 bg-red-600 p-5 text-2xl text-center font-bold rounded-md hover: cursor-pointer hover:brightness-90 hover:scale-105 transition-all  ">DELETE</button>
                    </div>
                ))}
            </div>
        </div>
    )

    async function addTask(input: string){{
        await axios.post("http://localhost:3000/data/", { name: input })
    }}
    async function deleteTask(task: taskType){
        await axios.delete(`http://localhost:3000/data/${task.id}`)
    }
}