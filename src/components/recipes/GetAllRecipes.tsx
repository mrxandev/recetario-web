import { useEffect, useState } from 'react';
import { getAllRecipes } from '../../services/recipes';

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
  time:string
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="rounded-xl shadow-md p-4 bg-white">
          <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
          <img src={recipe.image_url} alt={recipe.title} className="w-full rounded-lg mb-4" loading='lazy'/>
          <p className="mb-2">{recipe.description}</p>
          <span>{recipe.time} min</span>

          {recipe.video_id && (
            <iframe
              className="w-full rounded mb-4"
              height="200"
              src={`https://www.youtube.com/embed/${recipe.video_id}`}
              title="Video de la receta"
              allowFullScreen
            ></iframe>
          )}

          <div className="mt-4">
            <h3 className="font-semibold">Ingredientes:</h3>
            <ul className="list-disc pl-5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.cantidad} - {ing.descripcion}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Pasos:</h3>
            <ul className="pl-5">
              {recipe.steps.map((step,i) => (
                  <li key={i}>
                  {step.step}- 
                  {step.instruction} 
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
