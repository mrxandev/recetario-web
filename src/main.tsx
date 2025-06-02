import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import { AuthProvider } from './context/AuthContext'
import Signup from './components/auth/Signup'
import RecipePage from './pages/RecipePage'
import Navbar from './components/general/Navbar'
import NotFound from './pages/NotFound'
import Recipe from './components/recipes/Recipe'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='*' element={<NotFound/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/recetas' element={<RecipePage/>} />
        <Route path='/nosotros' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>Nosotros</h1>} />
        <Route path='/contacto' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>Contacto</h1>} />

        {/* Rutas especificas */}
        <Route path="/recipes/:recipeId" element={<Recipe />} />
     
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  </StrictMode>

)
