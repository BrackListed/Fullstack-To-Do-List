import { Check, Search, X } from "lucide-react";
import { Left } from "../Components/Left";
import { useEffect, useState } from "react";
import { API_URL } from "../api"
import axios from "axios";
import { useAuth } from "@clerk/react";

interface CompletedProps{
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

interface CompletedTasksType {
    id: string;
    userId: string;
    content: string;
    date_completed: string;
}


export function Completed({setToggleSignIn, setToggleSignUp}: CompletedProps){
    const [completedTasks, setCompletedTasks] = useState<CompletedTasksType[]>([])
    const [hasDeletedTask, sethasDeletedTask] = useState(false)
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
     const filteredItems = completedTasks.filter((item) => (item.content.toLowerCase()).includes(searchInput.toLowerCase()))
    const totalPages = Math.ceil(filteredItems.length / 5)
    const visibleItems = filteredItems.slice((page - 1) * 5, (page * 5)) //starts at what page you are, 2nd page 
    const { getToken } = useAuth()
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const response = await axios.get(`${API_URL}/complete`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            setCompletedTasks(response.data)
        }
        fetchExpressData()
    }, [])

    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const response = await axios.get(`${API_URL}/complete`, {headers: {Authorization: `Bearer ${token}` }, withCredentials: true})
            setCompletedTasks(response.data)
        }

        fetchExpressData()
    }, [completedTasks])

    useEffect(() => {
        if(hasDeletedTask){
            setTimeout(() => {
                sethasDeletedTask(false)
            }, 1000);
        }
    }, [hasDeletedTask])
    return(
        <div className="fixed inset-0 z-50 flex items-center bg-black/70 backdrop-blur-sm gap-30">
            {hasDeletedTask && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-rose-950/90 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><X/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task deleted successfully!</span>
            </div>}
            <Left
            setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
            <div className="flex-1 h-full items-center flex justify-center ">
                <div className="w-8/12 min-h-11/12 h-fit bg-zinc-900 rounded-2xl p-6 shadow-2xl flex flex-col">
                    <div className="pb-3 border-b border-zinc-800 flex justify-between">
                        <h2 className="text-2xl font-bold font-sans text-zinc-100 tracking-wide">Completed Tasks</h2>
                        <div className="flex-1 flex justify-end items-center gap-3">
                            <input onChange={(e) => {setSearchInput(e.target.value); }} className="rounded-lg  w-10/12 p-2 text-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-600 outline-none bg-zinc-800"></input> 
                            <Search className="text-zinc-50"/>
                        </div>
                    </div>
                    <div className="w-full flex-1 my-4 border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-start gap-4 text-zinc-400 font-sans min-h-70">
                        {completedTasks.length <= 0 && <span className="text-sm font-medium text-zinc-600 font-sans tracking-wide select-none">No tasks completed yet!</span>}
                        {completedTasks && <ul className="w-full flex flex-col gap-2.5">
                            {visibleItems.map((task) => (
                            <li className="w-full flex-1 bg-zinc-800/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 flex items-center justify-between gap-3">
                                    <Check className="text-green-500 font-bold"/>
                                    <div className="flex w-full justify-between"><span>{task.content}</span>
                                        <span className="text-sm text-gray-400 italic">{new Date(task.date_completed).toLocaleString()}</span>
                                    </div>
                                <button onClick = {() => deleteTask(task.id)}className="text-xl font-sans font-bold text-zinc-500 hover:cursor-pointer hover:text-zinc-300 transition-colors pr-1 leading-none"><X/></button>
                            </li>
                            ))}
                        </ul>}
                    </div>
                    <div className="flex gap-3 w-full justify-center items-center">
                        <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="px-4 py-2 text-xs font-sans font-semibold text-zinc-400 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-lg transition-all duration-150 active:scale-95 hover:cursor-pointer">Prev</button>
                        <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1) } disabled={page >= totalPages} className="px-4 py-2 text-xs font-sans font-semibold text-zinc-400 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-lg transition-all duration-150 active:scale-95 hover:cursor-pointer">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
    async function deleteTask(id: string){
        const token = await getToken()
        await axios.delete(`${API_URL}/complete/${id}`, { headers: { Authorization: `Bearer ${token}`}})
        sethasDeletedTask(true)
    }

}