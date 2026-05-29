import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <Routes>
      <Route path = "/" element = {<div className='flex-1'><App/></div>}></Route>
    </Routes>
    </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
