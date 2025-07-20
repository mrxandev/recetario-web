import { useEffect, useState } from 'react';
import { getAllRecipes, getRecipeFilters } from '../../services/recipes';
import { NavLink } from 'react-router-dom';
import { addToFavorites, removeFromFavorites, isFavorite } from '../../services/favorites';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Search, Filter, Clock, X } from 'lucide-react';
import heart from '../../assets/heart.svg';
import redheart from '../../assets/redheart.svg';

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

type Filters = {
  times: string[];
  tags: string[];
};

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<Filters>({ times: [], tags: [] });
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Load all recipes and filters
  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesData, filtersData] = await Promise.all([
          getAllRecipes(),
          getRecipeFilters()
        ]);
        
        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
        setAvailableFilters(filtersData);

        // Check favorites status for each recipe if user is logged in
        if (user) {
          const favoritesStatus: { [key: number]: boolean } = {};
          for (const recipe of recipesData) {
            try {
              const isFav = await isFavorite(user.id, recipe.id);
              favoritesStatus[recipe.id] = isFav;
            } catch (error) {
              console.error('Error checking favorite status:', error);
              favoritesStatus[recipe.id] = false;
            }
          }
          setLikes(favoritesStatus);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Handle search and filtering
  useEffect(() => {
    let result = recipes;

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.steps.some(step => 
          step.instruction.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply time filter
    if (selectedTimeFilter) {
      result = result.filter(recipe => recipe.time === selectedTimeFilter);
    }

    // Apply tag filter
    if (selectedTagFilter) {
      result = result.filter(recipe => {
        if (!recipe.tags) return false;
        return recipe.tags.some(tag => 
          Object.values(tag).some(value => value === selectedTagFilter)
        );
      });
    }

    setFilteredRecipes(result);
  }, [searchQuery, selectedTimeFilter, selectedTagFilter, recipes]);

  const handleLike = async (recipeId: number) => {
    if (!user) {
      showNotification(
        'warning',
        'Inicia sesión requerido',
        'Debes iniciar sesión para agregar recetas a favoritos'
      );
      return;
    }

    try {
      const currentLikeStatus = likes[recipeId];
      
      if (currentLikeStatus) {
        await removeFromFavorites(user.id, recipeId);
        setLikes(prev => ({ ...prev, [recipeId]: false }));
        showNotification(
          'success',
          'Eliminado de favoritos',
          'La receta se ha eliminado de tus favoritos'
        );
      } else {
        await addToFavorites(user.id, recipeId);
        setLikes(prev => ({ ...prev, [recipeId]: true }));
        showNotification(
          'success',
          'Añadido a favoritos',
          'La receta se ha agregado a tus favoritos'
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification(
        'error',
        'Error al actualizar favoritos',
        'No se pudo actualizar el estado de favoritos. Inténtalo de nuevo.'
      );
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTimeFilter('');
    setSelectedTagFilter('');
  };

  const hasActiveFilters = searchQuery.trim() || selectedTimeFilter || selectedTagFilter;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Todas las
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recetas
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre y filtra nuestras deliciosas recetas
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl border border-gray-700">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, ingredientes, instrucciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 font-medium"
            >
              <Filter size={18} />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                  {[searchQuery.trim(), selectedTimeFilter, selectedTagFilter].filter(Boolean).length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <X size={16} />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Time Filter */}
                <div>
                  <label className="flex text-sm font-medium text-gray-300 mb-3 items-center gap-2">
                    <Clock size={16} />
                    Tiempo de preparación
                  </label>
                  <select
                    value={selectedTimeFilter}
                    onChange={(e) => setSelectedTimeFilter(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <option value="">Todos los tiempos</option>
                    {availableFilters.times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter */}
                {availableFilters.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Categorías
                    </label>
                    <select
                      value={selectedTagFilter}
                      onChange={(e) => setSelectedTagFilter(e.target.value)}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <option value="">Todas las categorías</option>
                      {availableFilters.tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-300">
            {filteredRecipes.length === recipes.length 
              ? `Mostrando todas las recetas (${recipes.length})` 
              : `Mostrando ${filteredRecipes.length} de ${recipes.length} recetas`
            }
          </p>
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-semibold mb-4 text-white">No se encontraron recetas</h3>
            <p className="text-gray-400 mb-8 text-lg">Intenta con otros términos de búsqueda o ajusta los filtros</p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 font-medium"
            >
              Ver todas las recetas
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700 hover:border-gray-600">
              <NavLink to={`/recipes/${recipe.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading='lazy' 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Time badge */}
                  {recipe.time && (
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <Clock size={12} />
                      {recipe.time}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {recipe.description}
                  </p>
                  
                  {/* Recipe meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                      {recipe.ingredients.length} ingredientes
                    </span>
                    <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                      {recipe.steps.length} pasos
                    </span>
                  </div>
                </div>
              </NavLink>

              {/* Favorite Button */}
              <button
                type="button"
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 transform hover:scale-110"
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation();
                  handleLike(recipe.id); 
                }}
              >
                <img 
                  src={likes[recipe.id] ? redheart : heart} 
                  alt="Me gusta" 
                  className="w-5 h-5" 
                />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Filter Tags */}
        {availableFilters.times.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">Filtrado rápido por tiempo</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {availableFilters.times.map((time) => {
                const count = recipes.filter(r => r.time === time).length;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTimeFilter(selectedTimeFilter === time ? '' : time)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedTimeFilter === time
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                    }`}
                  >
                    {time} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
