import { ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-950">
      <div className="h-16 w-full flex justify-between items-center px-6 md:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <ChefHat className="text-indigo-500" size={30} />
          <p className="text-white text-xl font-bold">Kitchen Passion</p>
        </a>

        {/* Menú Desktop */}
        <nav className="hidden md:flex gap-6 font-bold">
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
          <a
            href="/contactoo"
            className="text-white hover:text-indigo-500 transition-colors duration-300"
          >
            Contacto
          </a>
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
          <a
            href="/contacto"
            className="block text-white hover:text-indigo-500 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
