import { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes';
import { NavLink } from 'react-router-dom';
import { addToFavorites, removeFromFavorites, isFavorite } from '../../services/favorites';
import { useAuth } from '../../context/AuthContext';
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
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    try {
      const currentLikeStatus = likes[recipeId];
      
      if (currentLikeStatus) {
        await removeFromFavorites(user.id, recipeId);
        setLikes(prev => ({ ...prev, [recipeId]: false }));
      } else {
        await addToFavorites(user.id, recipeId);
        setLikes(prev => ({ ...prev, [recipeId]: true }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert("Error al actualizar favoritos. Inténtalo de nuevo.");
    }
  };

  if (loading) return <p className="text-center">Cargando recetas...</p>;

  return (
    <>
      <div className="w-[90%] mx-auto justify-center items-center flex flex-wrap gap-4 p-4">
        {recipes.map((recipe) => (
          <NavLink key={recipe.id} to={`/recipes/${recipe.id}`} className="no-underline">
            <div className="h-[500px] w-[500px] bg-red-400 rounded-xl relative">
              <img 
                src={recipe.image_url} 
                alt={recipe.title} 
                className="w-full h-full object-cover rounded-xl" 
                loading='lazy' 
              />
              <button
                type="button"
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
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
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
}
