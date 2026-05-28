import { useEffect, useState } from "react"

interface taskType{
    name: string
    id: number;
}
export function Tasks(){
    const [tasks, setTask] = useState<taskType[]>([])

    useEffect(() => {
        const fetchExpressData = async() => {
        const response = await fetch("http://localhost:3000/data")
        const temptask = await response.json()
        setTask(temptask)
    }
    
        fetchExpressData()
    }, [])

    return(
        <div className="flex w-screen h-screen items-center justify-center">
            <div className="bg-zinc-600 w-7/12 min-h-11/12 h-fit rounded-lg p-3 gap-3 text-zinc-50 font-sans">
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

    function deleteTask(task: taskType){
        const updated = tasks.filter((t) => t.id !== task.id) //1 = 1 false so don't return 1, wtf is wrong?
        setTask(updated)
        console.log("Task: " + task.id)
    }
}