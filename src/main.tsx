import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { CartProvider } from './context/CartContext'
import RecipePage from './pages/RecipePage'
import Navbar from './components/general/Navbar'
import NotFound from './pages/NotFound'
import Recipe from './components/recipes/Recipe'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyRecipesPage from './pages/MyRecipesPage'
import PurchasedRecipesPage from './pages/PurchasedRecipesPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CartSidebar from './components/cart/CartSidebar'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar/>
            <CartSidebar/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='*' element={<NotFound/>} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage/>} />
              <Route path='/recetas' element={<RecipePage/>} />
              <Route path='/misrecetas' element={
                <ProtectedRoute>
                  <MyRecipesPage/>
                </ProtectedRoute>
              } />
              <Route path='/compradas' element={
                <ProtectedRoute>
                  <PurchasedRecipesPage/>
                </ProtectedRoute>
              } />
              <Route path='/nosotros' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>Nosotros</h1>} />
              <Route path='/contacto' element={<h1 className='text-6xl text-red-600 flex justify-center items-center'>Contacto</h1>} />

              {/* Rutas especificas */}
              <Route path="/recipes/:recipeId" element={<Recipe />} />
           
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>
)
