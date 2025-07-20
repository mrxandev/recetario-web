import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, ChevronDown, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleMyRecipesClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showNotification(
        'warning',
        'Inicia sesión requerido',
        'Debes iniciar sesión para ver tus recetas favoritas'
      );
      navigate('/login');
      return;
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Cerrar menús cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              Recetario
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/recetas"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/recetas') 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Todas las Recetas
              </Link>
              
              <Link
                to="/misrecetas"
                onClick={handleMyRecipesClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/misrecetas') 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Mis Recetas
              </Link>
            </div>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* User Dropdown */}
                <div
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className={`absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl transition-all duration-200 ${
                    isUserMenuOpen 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-gray-400 text-sm">Bienvenido,</p>
                    <p className="text-white font-medium truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-400 border border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-3 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/recetas"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive('/recetas') 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Todas las Recetas
            </Link>
            
            <Link
              to="/misrecetas"
              onClick={handleMyRecipesClick}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive('/misrecetas') 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Mis Recetas
            </Link>
          </div>

          {/* Auth Section - Mobile */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-700/50 rounded-lg">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">Bienvenido,</p>
                    <p className="text-white font-medium truncate text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-gray-700 transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-3 rounded-lg text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
