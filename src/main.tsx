import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import { AuthProvider } from './context/AuthContext'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='*' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>404</h1>} />
        <Route path='/login' element={<Login/>}/>
     
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  </StrictMode>

)
