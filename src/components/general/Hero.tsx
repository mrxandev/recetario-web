import { ChefHat, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

function Hero() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleFavoritesClick = (e: React.MouseEvent) => {
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
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-20 sm:pt-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Icon with animation */}
        <div className="mb-8 relative pt-4 sm:pt-0">
          <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl animate-float">
            <ChefHat className="text-white" size={60} />
          </div>
          <div className="absolute -top-0 sm:-top-2 -right-2">
            <Sparkles className="text-yellow-400 animate-pulse" size={24} />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Kitchen
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Passion
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
          Descubre el arte de la cocina con nuestras recetas cuidadosamente
        </p>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          seleccionadas para cada ocasión y gusto
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            to="/recetas"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-indigo-500/25 min-w-[200px]"
          >
            <span>Explorar Recetas</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </Link>

          <Link 
            to="/misrecetas"
            onClick={handleFavoritesClick}
            className="group relative inline-flex items-center justify-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 shadow-xl min-w-[200px]"
          >
            <Heart className="group-hover:text-red-400 transition-colors duration-300" size={18} />
            <span>Mis Favoritas</span>
          </Link>
        </div>

        {/* Stats or additional info */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              100+
            </div>
            <div className="text-gray-400 text-sm mt-1">Recetas Únicas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              4.9★
            </div>
            <div className="text-gray-400 text-sm mt-1">Calificación</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              50k+
            </div>
            <div className="text-gray-400 text-sm mt-1">Usuarios Felices</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
