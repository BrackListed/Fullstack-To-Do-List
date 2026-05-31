import { useState } from "react";
import { Left } from "../Components/Left";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

interface JournalProps{
    setToggleSignIn: (value: boolean) => void,
    setToggleSignUp: (value: boolean) => void
}

export function Journal({setToggleSignIn, setToggleSignUp}: JournalProps){
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    return (
        <div className="w-screen h-screen flex-1 flex">
            <Left setToggleSignIn={setToggleSignIn}
            setToggleSignUp={setToggleSignUp}
            />
            <div className="flex-1 flex items-center justify-center w-full h-full text-zinc-50">
                <div className="min-w-4xl max-w-fit h-10/12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl font-sans">
                    <div className="flex text-2xl border-b-2 border-zinc-700 py-5 justify-between">
                        <div className="flex gap-3 ">
                            <span>📅</span>
                            <DatePicker 
                            className="hover: cursor-pointer"
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}/>
                        </div>
                        <span>Entry Log</span>
                    </div>
                </div> 
            </div>
        </div>
    );
}