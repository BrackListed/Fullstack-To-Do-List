import { Save, Search, Star, X } from "lucide-react"
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
        fetchMovieData(searchInput)
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
                    <div className="w-full flex items-center p-3 glass-card-dark backdrop-blur-xl border border-white/10 rounded-xl h-12 overflow-hidden">
                        <Search/>
                        <input onChange={(e) => setSearchInput(e.target.value)} placeholder="Type here to search..." className="w-full h-full bg-transparent pl-5 pr-10 text-base text-gray-100 placeholder:text-gray-400 tracking-wide outline-none"></input>
                    </div>
                    <div className="glass-card-dark backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="border-t border-white/6 p-3 max-h-[50vh] overflow-y-auto overflow-x-hidden scrollbar-none">
                            <div className="rounded-lg transition-colors duration-150">
                                {movies.map((movie) => (<div className="flex flex-col justify-center gap-3 px-3 py-2.5 cursor-pointer">
                                    <div className="flex w-full h-full gap-3">
                                        <div className="w-11 h-16 shrink-0 rounded-[5px] overflow-hidden bg-white/5">
                                            <img src = "" className="w-full h-full object-cover"></img>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[14px] font-medium text-white line-clamp-1">{movie.title}</span>
                                            <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-500 flex-wrap">
                                                <span>Movie</span>
                                                <span className="text-white/15">|</span>
                                                <span>{movie.release_date.slice(0, 4)}</span>
                                                <span className="text-white/15">|</span>
                                                <span className="flex items-center gap-0.5">
                                                    <Star className="fill-yellow-400"/>
                                                    {movie.vote_average}
                                                </span>
                                            </div>
                                            <div className="overflow-hidden transition-all duration-300 ease-out max-h-full opacity-100">
                                                <span className="text-sm text-gray-400">{movie.overview}</span>
                                                <button className="flex mt-3 items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-[12px] font-medium hover:bg-white/90 hover:cursor-pointer transition-colors">
                                                    <Save/>
                                                    <span className="font-semibold">Add to Watchlist</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>))}
                            </div>
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