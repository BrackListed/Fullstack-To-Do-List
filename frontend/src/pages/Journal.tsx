import { useEffect, useState } from "react";
import { Left } from "../Components/Left";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { Check, PlusSquareIcon, Rotate3D, X } from "lucide-react";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { API_URL } from "../api";

interface JournalProps{
    setToggleSignIn: (value: boolean) => void,
    setToggleSignUp: (value: boolean) => void
}

interface JournalType {
    id: string;
    userId: number;
    content: string;
    date_created: string
}

export function Journal({setToggleSignIn, setToggleSignUp}: JournalProps){
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [addingEntry, setAddingEntry] = useState(false)
    const [entryContent, setEntryContent] = useState("")
    const [journal, setJournal] = useState<JournalType[]>([])
    const {getToken} = useAuth()
    const [modifyEntry, setModifyEntry] = useState(false)
    const [newEntryValue, setNewEntryValue] = useState("")
    const [hasAddedEntry, sethasAddedEntry] = useState(false)
    const [hasDeletedEntry, sethasDeletedEntry] = useState(false)
    const [hasUpdatedEntry, setHasUpdatedEntry] = useState(false)
    const [targetEntry, setTargetEntry] = useState<JournalType>()
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(journal.filter((j) => new Date(j.date_created).toLocaleDateString() === selectedDate?.toLocaleDateString()).length / 5) 
    //the above starts the array at 0, 
    //make it so that it only counts the ones whose date matches.
    const visibleItems = (journal.filter((j) => new Date(j.date_created).toLocaleDateString() === selectedDate?.toLocaleDateString())).slice((page - 1) * 5, (page * 5)) 
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const response = await axios.get(`${API_URL}/journal`, {headers: {Authorization: `Bearer ${token}`}, withCredentials: true})
            setJournal(response.data)
        }

        fetchExpressData()
    }, [])

    useEffect(() => {
        const fetchExpressData = async() => {
            const token = await getToken()
            const response = await axios.get(`${API_URL}/journal`, {headers: {Authorization: `Bearer ${token}`}, withCredentials: true})
            setJournal(response.data)
        }
        fetchExpressData()
    }, [journal])
    
    useEffect(() => {
        if(hasAddedEntry){
            setTimeout(() => {
                sethasAddedEntry(false)
            }, 1000);
        }
    }, [hasAddedEntry])

    useEffect(() => {
        if(hasUpdatedEntry){
            setTimeout(() => {
                setHasUpdatedEntry(false)
            }, 1000);
        }
    }, [hasUpdatedEntry])

    useEffect(() => {
        if(hasDeletedEntry){
            setTimeout(() => {
                sethasDeletedEntry(false)
            }, 1000);
        }
    }, [hasDeletedEntry])

    return (
        <div className="w-screen h-screen flex-1 flex">
            {hasAddedEntry && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><Check/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task added successfully!</span>
            </div>}
            {hasUpdatedEntry && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-blue-950/90 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><Rotate3D/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task updated!</span>
            </div>}
            {hasDeletedEntry && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-rose-950/90 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
                <span className="text-lg font-bold"><X/></span>
                <span className="text-sm font-medium font-sans tracking-wide">Task deleted successfully!</span>
            </div>}
            <Left setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
            <div className="flex-1 flex items-center justify-center w-full h-full text-zinc-50">
                <div className="w-4xl h-10/12 bg-zinc-900 border flex flex-col  border-zinc-800 rounded-2xl p-8 pb-24 shadow-2xl font-sans relative">
                    <div className="flex text-2xl border-b-2 border-zinc-700 py-5 justify-between">
                        <div className="flex gap-3 ">
                            <span>📅</span>
                            <DatePicker 
                            className="hover: cursor-pointer"
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}/>
                        </div>
                        <span>Number of Entries: {journal.filter(entry => selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()).length}</span>
                        
                    </div>
                    <div className="my-5 flex flex-col">
                        <div onClick={() => setAddingEntry(true)} className="flex gap-3 text-2xl hover:curosr-pointer hover:p-2 hover:scale-105 transition-all hover:cursor-pointer hover:bg-zinc-800 w-fit rounded-2xl"><PlusSquareIcon size={32}/>Add Journal Entry</div>
                        {addingEntry && <input onChange={(e) => setEntryContent(e.target.value)} onBlur={() => setAddingEntry(false)} onKeyDown = {(e) => {if(e.key === "Enter"){
                            addEntry(entryContent, selectedDate!)
                            setAddingEntry(false)}}} className="bg-zinc-800 focus-visible:ring-2 focus-visible:ring-violet-700 rounded-lg outline-none my-5 p-3 text-2xl"></input>}
                            {journal.filter(entry => selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()).length === 0 && <span className="w-full text-center my-5 text-2xl italic text-gray-500">No journal entry for {selectedDate?.toLocaleDateString()}, add one to get started!</span>}
                    </div>
                    {visibleItems.map((entry) => (
                    <div className="text-2xl flex my-2 justify-between w-full">
                        {(selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()) &&<div className="justify-between w-full flex">
                            {(modifyEntry === true && entry.id === targetEntry!.id) && <input onKeyDown={(e) => {if(e.key === "Enter"){{setModifyEntry(false);if(newEntryValue.trim() !== "" && newEntryValue !== entry.content){updateEntry(newEntryValue, entry.id)}}}}} onBlur={() => {setModifyEntry(false);if(newEntryValue.trim() !== "" && newEntryValue !== entry.content){{updateEntry(newEntryValue, entry.id)}}}} onChange={(e) => setNewEntryValue(e.target.value)} defaultValue={entry.content} className="w-full bg-zinc-800/20 border border-blue-500 rounded-lg p-2 text-2xl text-zinc-100 font-sans focus:outline-none shadow-[0_0_10px_rgba(59,130,246,0.2)]"></input>}
                            {modifyEntry === false && <span className="flex justify-between w-full" onClick={() => {setModifyEntry(true); setTargetEntry(entry)}}><span>{entry.content}</span> <span className="px-5 text-sm text-gray-400 italic flex items-center">{new Date(entry.date_created).toLocaleTimeString()}</span></span>}
                            <button onClick={() => deleteEntry(entry.id)} className="hover:bg-zinc-700 rounded-lg hover:cursor-pointer hover:p-1 transition-all"><X/></button>
                        </div>}
                    </div>
                    ))}
                    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
                        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-lg transition-all duration-150 active:scale-95 hover:cursor-pointer">Prev</button>
                        <span className="text-zinc-400 text-sm font-medium">{page} / {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-lg transition-all duration-150 active:scale-95 hover:cursor-pointer">Next</button>
                    </div>
                </div> 
            </div>
        </div>
    )

    async function addEntry(content: string, selectedDate: Date){
        sethasAddedEntry(true)
        const token = await getToken()
        await axios.post(`${API_URL}/journal/${selectedDate.toISOString()}`, {content: content}, {headers: {Authorization: `Bearer ${token}`}})
    }

    async function deleteEntry(id: string){
        sethasDeletedEntry(true)
        const token = await getToken()
        await axios.delete(`${API_URL}/journal/${id}`, {headers: {Authorization: `Bearer ${token}`}})
    }

    async function updateEntry(content: string, id: string){
        setHasUpdatedEntry(true)
        const token = await getToken()
        await axios.put(`${API_URL}/journal/${id}`, {content: content}, {headers: {Authorization: `Bearer ${token}`}})
    }
}