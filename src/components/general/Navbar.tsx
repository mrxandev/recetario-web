import { ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from '../../context/AuthContext'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
     const dataId = "sb-ppbqkbzqavtqyfghmopc-auth-token" 
     window.localStorage.removeItem(dataId)
  }

  return (
    <header className="bg-gray-950">
      <div className="h-16 w-screen flex justify-between items-center px-6 md:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <ChefHat className="text-indigo-500" size={30} />
          <p className="text-white text-xl font-bold">Kitchen Passion</p>
        </a>

        {/* Menú Desktop */}
        <nav className="hidden md:flex justify-center items-center gap-6 font-bold">
          <a
            href="/recetas"
            className="text-white hover:text-indigo-500 transition-colors duration-300"
          >
            Recetas
          </a>
          <a
            href="/nosotros"
            className="text-white hover:text-indigo-500 transition-colors duration-300"
          >
            Nosotros
          </a>
        
          {user ? ( 
            <a
              href="/"
              className="text-white bg-red-500 hover:bg-red-500/70 p-2 rounded-xl transition-colors duration-300"
              onClick={handleLogout}
            >
              Cerrar Sesion
            </a>
          ) : ( 
            <a
              href="/login"
              className="text-white bg-green-500 hover:bg-green-500/70 p-2 rounded-xl transition-colors duration-300"
            >
              Acceder
            </a>
          )}
        </nav>

        {/* Botón de menú móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Móvil desplegable */}
      {isOpen && (
        <div className="md:hidden bg-gray-950 px-6 py-4 space-y-4 font-bold">
          <a
            href="/recetas"
            className="block text-white hover:text-indigo-500 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Recetas
          </a>
          <a
            href="/nosotros"
            className="block text-white hover:text-indigo-500 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Nosotros
          </a>
       
          {user ? (
            <a
              href="/" 
              className="block text-white bg-red-600 hover:bg-red-800 p-2 rounded-xl transition-colors duration-300"
              onClick={handleLogout}
            >
              Cerrar Sesion
            </a>
          ) : (
            <a
              href="/login"
              className="block text-white bg-green-600 hover:bg-green-800 p-2 rounded-xl transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Acceder
            </a>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;