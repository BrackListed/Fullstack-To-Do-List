import axios from "axios"
import { useAuth } from "@clerk/react"


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
export const api = axios.create({ baseURL: API_URL, withCredentials: true })

export function useApi() {
    const { getToken } = useAuth()
    
    const api = axios.create({ baseURL: API_URL, withCredentials: true })
    
    api.interceptors.request.use(async (config) => {
        const token = await getToken()
        config.headers.Authorization = `Bearer ${token}`
        return config
    })
    
    return api
}