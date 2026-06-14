import { Search, X } from "lucide-react"
import { Left } from "../Components/Left"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/react"


interface WatchlistProps{
    setToggleSignIn: (value: boolean) => void
    setToggleSignUp: (value: boolean) => void
}

interface MoviesType {
    title: string
    release_date: string
    vote_average: number
    genre_ids: number[]
    poster_path: string  
    overview: string
}

export function Watchlist({setToggleSignIn, setToggleSignUp}: WatchlistProps){
    const [movies, setMovies] = useState<MoviesType[]>([])
    const [searchInput, setSearchInput] = useState("")
    const [toggleSearch, setToggleSearch] = useState(false)
    useEffect(() => {
        const fetchMovieData = async(query: string) => {
            const result = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, {withCredentials: false, headers: {Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NWMxZDljOTRiODVmNjE3ZDk5MDI5ZjliZWI5ODNlNSIsIm5iZiI6MTc4MTQyMzcyOS43MjcsInN1YiI6IjZhMmU1ZTcxZTk5OTE2MjA0MjJjODFiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wRdCLwJqZ95_DJI73iAz2RqHsGN5TnMl7U6ET-HFYNQ`}})
            setMovies(result.data.results)
        }
        fetchMovieData('Batman')
    }, [searchInput])
    return(
        <div className="flex w-screen h-screen">
            <Left
            setToggleSignIn = {setToggleSignIn}
            setToggleSignUp = {setToggleSignUp}
            ></Left>
            {toggleSearch && <div className="text-zinc-50 fixed inset-0 bg-black/60 backdrop-blur-md z-100 flex items-center justify-center p-4 font-sans selection:bg-zinc-700">
                <div className="flex flex-col gap-3 w-110">
                    <div className="flex justify-between">
                        <span className="text-2xl font-semibold">Search</span>
                        <div className="flex gap-2">
                            <div className="flex h-9 items-center justify-center rounded-lg px-3 text-[13px] text-gray-300 glass-card-dark backdrop-blur-xl border border-white/10 w-44 pl-4">Movies & Tv Shows</div>
                            <button onClick={() => setToggleSearch(false)} className=" hover:cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors group glass-card-dark backdrop-blur-xl border border-white/10 aspect-square flex items-center justify-center h-9"><X/></button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="flex-1 flex flex-col text-zinc-50 px-10">
                <div className="w-full h-1/12 flex justify-between py-10 items-center">
                    <h1 className="text-3xl font-semibold">Watchlist</h1>
                    <div className="flex w-full justify-end gap-2 items-center">
                        <div className="p-3 hover:cursor-pointer hover:bg-neutral-700 hover:text-violet-500 rounded-lg">
                            <Search onClick={() => setToggleSearch(true)} width={30} height={30}/>
                        </div>
                        
                    </div>
                </div>
                <div>
                    <span className="font-semibold border-b-4 border-white w-fit">My Collection</span>
                    <div className="border-b-2 border-white/10"></div>
                </div>
                <div className="mt-10 flex w-12/12 gap-5 flex-wrap justify-center">
                    <div className="flex flex-col">
                        <div className="w-51 h-70 border-white/10 border-2 bg-neutral-900 rounded-md"></div>
                        <span className="font-semibold mt-3">Title</span>
                        <span className="text-sm text-gray-500">Author/Director</span>
                    </div>
                </div>
            </div>
        </div>
    )
}