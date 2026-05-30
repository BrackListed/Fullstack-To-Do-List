import { Check, X } from "lucide-react";
import { Left } from "../Components/Left";
import { useEffect, useState } from "react";
import axios from "axios";

interface CompletedProps{
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

interface CompletedTasksType {
    id: number;
    userId: string;
    content: string;
}

export function Completed({setToggleSignIn, setToggleSignUp}: CompletedProps){
    const [completedTasks, setCompletedTasks] = useState<CompletedTasksType[]>([])
    useEffect(() => {
        const fetchExpressData = async() => {
            const response = await axios.get("http://localhost:3000/complete", {withCredentials: true})
            setCompletedTasks(response.data)
        }

        fetchExpressData()
    }, [])

    useEffect(() => {
        const fetchExpressData = async() => {
            const response = await axios.get("http://localhost:3000/complete", {withCredentials: true})
            setCompletedTasks(response.data)
        }

        fetchExpressData()
    }, [completedTasks])
    return(
        <div className="fixed inset-0 z-50 flex items-center bg-black/70 backdrop-blur-sm gap-30">
            <Left
            setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
            <div className="flex-1 h-full items-center flex justify-center ">
                <div className="w-8/12 min-h-11/12 h-fit bg-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col">
                    <div className="pb-3 border-b border-zinc-800">
                        <h2 className="text-2xl font-bold font-sans text-zinc-100 tracking-wide">Completed Tasks</h2>
                    </div>
                    <div className="w-full flex-1 my-4 border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-start gap-4 text-zinc-400 font-sans min-h-70">
                        <ul className="w-full flex flex-col gap-2.5">
                            {completedTasks.map((task) => (
                            <li className="w-full bg-zinc-800/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Check className="text-green-500 font-bold"/>
                                    <span>{task.content}</span>
                                </div>
                                <button onClick = {() => deleteTask(task.id)}className="text-xl font-sans font-bold text-zinc-500 hover:cursor-pointer hover:text-zinc-300 transition-colors pr-1 leading-none"><X/></button>
                            </li>
                            ))}
                        
                        </ul>
                    </div>
                    <span className="text-center text-xs text-zinc-600 font-sans">End of Completed Tasks</span>
                </div>
            </div>
        </div>
    )
    async function deleteTask(id: number){
        await axios.delete(`http://localhost:3000/complete/${id}`)
    }
}