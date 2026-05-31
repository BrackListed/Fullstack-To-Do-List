import { useEffect, useState } from "react";
import { Left } from "../Components/Left";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { PlusSquareIcon, X } from "lucide-react";
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
    return (
        <div className="w-screen h-screen flex-1 flex">
            <Left setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
            <div className="flex-1 flex items-center justify-center w-full h-full text-zinc-50">
                <div className="min-w-4xl max-w-fit h-10/12 bg-zinc-900 border flex flex-col border-zinc-800 rounded-2xl p-8 shadow-2xl font-sans">
                    <div className="flex text-2xl border-b-2 border-zinc-700 py-5 justify-between">
                        <div className="flex gap-3 ">
                            <span>📅</span>
                            <DatePicker 
                            className="hover: cursor-pointer"
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}/>
                        </div>
                        {journal.map((entry) => (
                            <div>
                                {(selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()) &&<span>{new Date(entry.date_created).toLocaleTimeString()}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="my-10 flex flex-col">
                        <div onClick={() => setAddingEntry(true)} className="flex gap-3 text-2xl hover:curosr-pointer hover:p-2 hover:scale-105 transition-all hover:cursor-pointer hover:bg-zinc-800 w-fit rounded-2xl"><PlusSquareIcon size={32}/>Add Journal Entry</div>
                        {addingEntry && <input onChange={(e) => setEntryContent(e.target.value)} onBlur={() => setAddingEntry(false)} onKeyDown = {(e) => {if(e.key === "Enter"){
                            addEntry(entryContent, selectedDate!)
                            setAddingEntry(false)}}} className="bg-zinc-800 focus-visible:ring-2 focus-visible:ring-violet-700 rounded-lg outline-none my-5 p-3 text-2xl"></input>}
                            {journal.filter(entry => selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()).length === 0 && <span className="w-full text-center my-5 text-2xl italic text-gray-500">No journal entry for {selectedDate?.toLocaleDateString()}, add one to get started!</span>}
                    </div>
                    {journal.map((entry) => (
                    <div className="text-2xl flex justify-between w-full">
                        {(selectedDate?.toLocaleDateString() === new Date(entry.date_created).toLocaleDateString()) &&<div className="justify-between w-full flex">
                            {modifyEntry === false && <span onClick={() => setModifyEntry(true)}>{entry.content}</span>}
                            {modifyEntry && <input onChange={(e) => setNewEntryValue(e.target.value)} onKeyDown={(e) => {if(e.key === "Enter"){
                                updateEntry(newEntryValue, entry.id)
                                setModifyEntry(false)
                            }}} onBlur={() => {updateEntry(newEntryValue, entry.id); setModifyEntry(false)}} defaultValue={entry.content} className="w-full bg-zinc-800/20 border border-blue-500 rounded-lg p-2 text-2xl text-zinc-100 font-sans focus:outline-none shadow-[0_0_10px_rgba(59,130,246,0.2)]"></input>}
                            <button onClick={() => deleteEntry(entry.id)} className="hover:bg-zinc-700 rounded-lg hover:cursor-pointer hover:p-1 transition-all"><X/></button>
                        </div>}
                    </div>
                    ))}
                </div> 
            </div>
        </div>
    )

    async function addEntry(content: string, selectedDate: Date){
        const token = await getToken()
        await axios.post(`${API_URL}/journal/${selectedDate.toISOString()}`, {content: content}, {headers: {Authorization: `Bearer ${token}`}})
    }

    async function deleteEntry(id: string){
        const token = await getToken()
        await axios.delete(`${API_URL}/journal/${id}`, {headers: {Authorization: `Bearer ${token}`}})
    }

    async function updateEntry(content: string, id: string){
        const token = await getToken()
        await axios.put(`${API_URL}/journal/${id}`, {content: content}, {headers: {Authorization: `Bearer ${token}`}})
    }
}