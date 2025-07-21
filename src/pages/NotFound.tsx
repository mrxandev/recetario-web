
import { ChefHat, Home, Search, Clock, Heart } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <section className="flex flex-col items-center justify-center text-center">
            {/* Ícono principal con efectos modernos */}
            <div className="relative mb-12">
              <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-full p-12 shadow-2xl border border-gray-700/50">
                <ChefHat className="h-32 w-32 text-indigo-400" strokeWidth={1.5} />
              </div>
            </div>

          {/* Texto principal */}
          <div className="mb-12 space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                ¡Receta no encontrada!
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Parece que esta receta se ha quemado o nunca existió en nuestra cocina. 
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Pero no te preocupes, tenemos muchas otras delicias esperándote.
            </p>
          </div>

          {/* Botón de acción principal */}
          <div className="mb-16">
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-indigo-500/25 min-w-[200px]"
            >
              <Home className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Sugerencias */}
          <div className="w-full max-w-4xl">
            <h3 className="text-2xl font-bold text-white mb-8">
              ¿Qué tal si pruebas esto?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-full transition-all duration-300 group-hover:scale-110">
                    <Search className="h-8 w-8 text-indigo-400 transition-colors duration-300 hover:text-indigo-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Explorar recetas</h4>
                  <p className="text-gray-300">
                    Descubre nuestra amplia colección de recetas deliciosas
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-full transition-all duration-300 group-hover:scale-110">
                    <Clock className="h-8 w-8 text-purple-400 transition-colors duration-300 hover:text-purple-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Recetas rápidas</h4>
                  <p className="text-gray-300">
                    Platos deliciosos listos en menos de 30 minutos
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-pink-900/50 to-indigo-900/50 rounded-full transition-all duration-300 group-hover:scale-110">
                    <Heart className="h-8 w-8 text-pink-400 transition-colors duration-300 hover:text-pink-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">Más populares</h4>
                  <p className="text-gray-300">
                    Las recetas favoritas de nuestra comunidad
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
    </main>
  )
}
