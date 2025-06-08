import { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes';
import { NavLink } from 'react-router-dom';

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

  useEffect(() => {
    getAllRecipes()
      .then((data) => {
        setRecipes(data);
        console.log(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Cargando recetas...</p>;

  return (
    <>
      <div className="w-[90%] mx-auto justify-center items-center flex flex-wrap gap-4 p-4">
        {recipes.map((recipe) => (
          <NavLink key={recipe.id} to={`/recipes/${recipe.id}`} className="no-underline">
            {/* <div key={recipe.id} className="relative  rounded-xl shadow-md p-4 bg-gray-950">
              <img src={recipe.image_url} alt={recipe.title} className=" rounded-lg mb-4 " loading='lazy' />

              <h2 className="absolute w-full h-full text-xl font-bold mb-2">{recipe.title}</h2>

            </div> */}

            <div className=" h-[500px] w-[500px] bg-red-400 rounded-xl">
                <img src={recipe.image_url} alt={recipe.title} className="relative w-full h-full rounded-lg mb-4 " loading='lazy' />
                 <p className="absolute inset-0 z-50  text-xl font-bold mb-2 text-white">{recipe.title}</p>

            </div>

          </NavLink>
        ))}
      </div>
    </>
  );
}
