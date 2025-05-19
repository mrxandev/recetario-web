import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='*' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>404</h1>} />
      </Routes>
    </BrowserRouter>

  </StrictMode>

)
