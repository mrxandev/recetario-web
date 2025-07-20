import { useEffect, useState } from 'react';
import { getUserFavorites, removeFromFavorites } from '../services/favorites';
import { useAuth } from '../context/AuthContext';
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
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert("Error al quitar de favoritos. Inténtalo de nuevo.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 flex items-center justify-center gap-3">
          <Heart className="text-red-500" size={40} />
          Mis Recetas Favoritas
        </h1>
        <p className="text-gray-300 text-center">Tus recetas guardadas para cocinar cuando quieras</p>
      </div>

      {/* Search Bar */}
      {favorites.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar en tus recetas favoritas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Results Counter */}
      {favorites.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-gray-300">
            {filteredFavorites.length === favorites.length 
              ? `Tienes ${favorites.length} receta${favorites.length === 1 ? '' : 's'} favorita${favorites.length === 1 ? '' : 's'}` 
              : `Mostrando ${filteredFavorites.length} de ${favorites.length} recetas favoritas`
            }
          </p>
        </div>
      )}

      {/* No Favorites */}
      {favorites.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold mb-2">Aún no tienes recetas favoritas</h3>
          <p className="text-gray-400 mb-6">Explora nuestras recetas y marca tus favoritas haciendo clic en el corazón</p>
          <NavLink
            to="/recetas"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
          >
            Explorar Recetas
          </NavLink>
        </div>
      )}

      {/* No Search Results */}
      {favorites.length > 0 && filteredFavorites.length === 0 && searchQuery.trim() && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron recetas</h3>
          <p className="text-gray-400 mb-4">Intenta con otros términos de búsqueda</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
          >
            Ver todas mis favoritas
          </button>
        </div>
      )}

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFavorites.map((favorite) => (
          <div key={favorite.id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <NavLink to={`/recipes/${favorite.recipes.id}`} className="block">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={favorite.recipes.image_url} 
                  alt={favorite.recipes.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  loading='lazy' 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Time badge */}
                {favorite.recipes.time && (
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} />
                    {favorite.recipes.time}
                  </div>
                )}

                {/* Favorite indicator */}
                <div className="absolute bottom-3 right-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Heart size={12} fill="white" />
                  Favorita
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                  {favorite.recipes.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                  {favorite.recipes.description}
                </p>
                
                {/* Recipe meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{favorite.recipes.ingredients.length} ingredientes</span>
                  <span>{favorite.recipes.steps.length} pasos</span>
                </div>

                {/* Date added to favorites */}
                <div className="mt-2 text-xs text-gray-500">
                  Agregada el {new Date(favorite.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
            </NavLink>

            {/* Remove from Favorites Button */}
            <button
              type="button"
              className="absolute top-3 right-3 z-10 bg-red-500/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
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
        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Estadísticas de tus favoritas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-400">{favorites.length}</div>
              <div className="text-sm text-gray-300">Recetas favoritas</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(favorites.reduce((acc, fav) => acc + fav.recipes.ingredients.length, 0) / favorites.length || 0)}
              </div>
              <div className="text-sm text-gray-300">Promedio de ingredientes</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(favorites.reduce((acc, fav) => acc + fav.recipes.steps.length, 0) / favorites.length || 0)}
              </div>
              <div className="text-sm text-gray-300">Promedio de pasos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
