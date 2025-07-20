import { useEffect, useState } from 'react';
import { getUserFavorites, removeFromFavorites } from '../services/favorites';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { NavLink, Navigate } from 'react-router-dom';
import { Search, Clock, Trash2, Heart } from 'lucide-react';

type Ingredient = {
  cantidad: string;
  descripcion: string;
};

type Step = {
  step: string;
  instruction: string;
};

type Recipe = {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  image_url: string;
  video_id: string;
  created_at: string;
  time: string;
  tags?: Array<{ [key: number]: string }>;
};

type FavoriteWithRecipe = {
  id: number;
  user_id: string;
  recipe_id: number;
  created_at: string;
  recipes: Recipe;
};

export default function MyRecipesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithRecipe[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteWithRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();

  // Redirect to login if not authenticated (but only after auth has loaded)
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Load user's favorite recipes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      
      try {
        const favoritesData = await getUserFavorites(user.id);
        setFavorites(favoritesData || []);
        setFilteredFavorites(favoritesData || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Handle search filtering
  useEffect(() => {
    let result = favorites;

    if (searchQuery.trim()) {
      result = result.filter(favorite => 
        favorite.recipes.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.recipes.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.recipes.ingredients.some(ingredient => 
          ingredient.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        favorite.recipes.steps.some(step => 
          step.instruction.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredFavorites(result);
  }, [searchQuery, favorites]);

  const handleRemoveFavorite = async (recipeId: number) => {
    if (!user) return;
    
    setRemovingId(recipeId);
    try {
      await removeFromFavorites(user.id, recipeId);
      // Update local state
      const updatedFavorites = favorites.filter(fav => fav.recipes.id !== recipeId);
      setFavorites(updatedFavorites);
      setFilteredFavorites(updatedFavorites.filter(favorite => 
        searchQuery.trim() === '' ||
        favorite.recipes.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.recipes.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.recipes.ingredients.some(ingredient => 
          ingredient.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        favorite.recipes.steps.some(step => 
          step.instruction.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
      showNotification(
        'success',
        'Eliminado de favoritos',
        'La receta se ha eliminado de tus favoritos'
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      showNotification(
        'error',
        'Error al eliminar favorito',
        'No se pudo quitar la receta de favoritos. Inténtalo de nuevo.'
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-700 border-t-indigo-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Cargando tus recetas favoritas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Heart className="text-red-500 animate-pulse" size={48} />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mis Recetas
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Favoritas
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tus recetas guardadas para cocinar cuando quieras
          </p>
        </div>

        {/* Search Bar */}
        {favorites.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl border border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar en tus recetas favoritas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Results Counter */}
        {favorites.length > 0 && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-300">
              {filteredFavorites.length === favorites.length 
                ? `Tienes ${favorites.length} receta${favorites.length === 1 ? '' : 's'} favorita${favorites.length === 1 ? '' : 's'}` 
                : `Mostrando ${filteredFavorites.length} de ${favorites.length} recetas favoritas`
              }
            </p>
          </div>
        )}

        {/* No Favorites */}
        {favorites.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-8 opacity-50">💔</div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Aún no tienes recetas favoritas</h3>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Explora nuestras deliciosas recetas y marca tus favoritas haciendo clic en el corazón
            </p>
            <NavLink
              to="/recetas"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
            >
              Explorar Recetas
            </NavLink>
          </div>
        )}

        {/* No Search Results */}
        {favorites.length > 0 && filteredFavorites.length === 0 && searchQuery.trim() && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-semibold mb-4 text-white">No se encontraron recetas</h3>
            <p className="text-gray-400 mb-8 text-lg">Intenta con otros términos de búsqueda</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 font-medium"
            >
              Ver todas mis favoritas
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredFavorites.map((favorite) => (
            <div key={favorite.id} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700 hover:border-gray-600">
              <NavLink to={`/recipes/${favorite.recipes.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={favorite.recipes.image_url} 
                    alt={favorite.recipes.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading='lazy' 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Time badge */}
                  {favorite.recipes.time && (
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <Clock size={12} />
                      {favorite.recipes.time}
                    </div>
                  )}

                  {/* Favorite indicator */}
                  <div className="absolute bottom-4 right-4 bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 border border-white/10">
                    <Heart size={12} fill="white" />
                    Favorita
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                    {favorite.recipes.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {favorite.recipes.description}
                  </p>
                  
                  {/* Recipe meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                      {favorite.recipes.ingredients.length} ingredientes
                    </span>
                    <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                      {favorite.recipes.steps.length} pasos
                    </span>
                  </div>

                  {/* Date added to favorites */}
                  <div className="text-xs text-gray-500 text-center bg-gray-700/30 py-2 rounded-lg">
                    Agregada el {new Date(favorite.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </NavLink>

              {/* Remove from Favorites Button */}
              <button
                type="button"
                className="absolute top-4 right-4 z-10 bg-red-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation();
                  handleRemoveFavorite(favorite.recipes.id); 
                }}
                disabled={removingId === favorite.recipes.id}
                title="Quitar de favoritos"
              >
                {removingId === favorite.recipes.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        {favorites.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-8 text-center text-white">Estadísticas de tus favoritas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-6 text-center border border-gray-600">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {favorites.length}
                </div>
                <div className="text-gray-300 font-medium">
                  Receta{favorites.length === 1 ? '' : 's'} favorita{favorites.length === 1 ? '' : 's'}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 text-center border border-gray-600">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {Math.round(favorites.reduce((acc, fav) => acc + fav.recipes.ingredients.length, 0) / favorites.length || 0)}
                </div>
                <div className="text-gray-300 font-medium">Promedio de ingredientes</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 text-center border border-gray-600">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {Math.round(favorites.reduce((acc, fav) => acc + fav.recipes.steps.length, 0) / favorites.length || 0)}
                </div>
                <div className="text-gray-300 font-medium">Promedio de pasos</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
