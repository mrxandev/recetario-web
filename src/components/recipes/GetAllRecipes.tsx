import { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes';
import { NavLink } from 'react-router-dom';
import { addToFavorites, removeFromFavorites, isFavorite } from '../../services/favorites';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import AddToCartButton from '../cart/AddToCartButton';
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
  time: string
};

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    getAllRecipes()
      .then(async (data) => {
        setRecipes(data);
        console.log(data);
        
        // Check favorites status for each recipe if user is logged in
        if (user) {
          const favoritesStatus: { [key: number]: boolean } = {};
          for (const recipe of data) {
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
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
        <p className="text-gray-400 text-lg">Cargando recetas...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Todas las Recetas
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre nuestra colección completa de recetas premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="relative">
                <NavLink to={`/recipes/${recipe.id}`}>
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading='lazy' 
                  />
                </NavLink>
                
                {/* Favorite button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-all duration-200"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleLike(recipe.id); 
                  }}
                >
                  <img 
                    src={likes[recipe.id] ? redheart : heart} 
                    alt="Me gusta" 
                    className="w-6 h-6" 
                  />
                </button>

                {/* Price badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                    Premium
                  </span>
                </div>
              </div>

              <div className="p-6">
                <NavLink to={`/recipes/${recipe.id}`} className="no-underline">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>
                </NavLink>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    ⏱️ {recipe.time} min
                  </span>
                  <span>🔥 Medio</span>
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  recipe={{
                    id: recipe.id.toString(),
                    title: recipe.title,
                    image: recipe.image_url,
                    category: 'Recetas Premium',
                    cookingTime: `${recipe.time} min`,
                    difficulty: 'Medio',
                  }}
                  price={9.99}
                  isPremium={true}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
