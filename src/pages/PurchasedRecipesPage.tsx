import { useEffect } from "react";
import { Download, Calendar, Clock, BarChart3 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateRecipePDF } from "../utils/pdfGenerator";

export default function PurchasedRecipesPage() {
  const { state } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleDownload = (recipe: any) => {
    generateRecipePDF(recipe);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
        return 'text-green-400 bg-green-900/20';
      case 'medio':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'difícil':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mis Recetas Compradas
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Todas tus recetas premium están aquí para que las disfrutes cuando quieras
          </p>
        </div>

        {state.purchasedRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto">
              <Download className="h-16 w-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No tienes recetas compradas
              </h3>
              <p className="text-gray-400 mb-6">
                Explora nuestro catálogo y encuentra recetas increíbles para comprar
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Explorar Recetas
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.purchasedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                      ${recipe.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.cookingTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {recipe.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4" />
                    Comprado el {formatDate(recipe.purchaseDate)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(recipe)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {state.purchasedRecipes.length > 0 && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {state.purchasedRecipes.length}
              </div>
              <div className="text-gray-400 text-sm mt-1">Recetas Compradas</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ${state.purchasedRecipes.reduce((sum, recipe) => sum + recipe.price, 0).toFixed(0)}
              </div>
              <div className="text-gray-400 text-sm mt-1">Total Invertido</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                {new Set(state.purchasedRecipes.map(r => r.category)).size}
              </div>
              <div className="text-gray-400 text-sm mt-1">Categorías</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
