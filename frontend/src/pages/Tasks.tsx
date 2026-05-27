import { useEffect, useState } from "react"




interface taskType {
    name: string
    id: number;
}
export function Tasks(){
    const [tasks, setTask] = useState<taskType[]>([])

    useEffect(() => {
        const fetchExpressData = async() => {
        const response = await fetch("http://localhost:3000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Jayce",
                id: 1
            })
        })
        const temptask = await response.json()
        setTask(temptask)
    }
    
        fetchExpressData()
    }, [])

    return(
        <div className="flex w-screen h-screen items-center justify-center">
            <div className="bg-zinc-600 w-7/12 h-11/12 rounded-lg p-3 gap-3 text-zinc-50 font-sans">
                {tasks.map((task: taskType) => (
                    <li>{task.name}</li>
                ))}
            </div>
        </div>
    )
}