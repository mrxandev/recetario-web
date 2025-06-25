import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecifictRecipe } from "../../services/recipes";
import { Clock } from "lucide-react";


type Ingredient = {
    cantidad: string;
    descripcion: string;
}

type Step = {
    step: string;
    instruction: string;
}

type RecipeType = {
    id: number;
    title: string;
    description: string;
    ingredients: Ingredient[];
    steps: Step[];
    image_url: string;
    video_id: string;
    created_at: string;
    time: string;
    tags?: Array<{ [key: string]: string }>;
}

function Recipe() {
    const { recipeId } = useParams<{ recipeId: string }>();
    const [recipe, setRecipe] = useState<RecipeType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLike, setIsLike] = useState(false);

    useEffect(() => {

        if (recipeId) {

            const idAsNumber = parseInt(recipeId, 10);


            if (isNaN(idAsNumber)) {
                setError("ID de receta inválido.");
                setLoading(false);
                return;
            }

            getSpecifictRecipe(idAsNumber.toString())
                .then((data: RecipeType[]) => {
                    setRecipe(data[0]);
                })
                .catch((err) => {
                    console.error("Error fetching recipe:", err);
                    setError("No se pudo cargar la receta. Por favor, inténtalo de nuevo.");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {

            setLoading(false);
            setError("ID de receta no proporcionado en la URL.");
        }
    }, [recipeId]);


    if (loading) {
        return <p className="text-center mt-4">Cargando receta...</p>;
    }

    if (error) {
        return <p className="text-center mt-4 text-red-500">{error}</p>;
    }

    if (!recipe) {
        return <p className="text-center mt-4">Receta no encontrada.</p>;
    }


    return (
        <div className="w-[70%] mx-auto my-10 text-white">

            <div className="mb-6">
                <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold mb-4 text-orange-400">{recipe.title}</h1>
                {
                    isLike ? (
                        <button
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => setIsLike(!isLike)}
                        >
                            <span className="text-2xl">❤️</span>
                        </button>
                    ) : (
                        <button
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                            onClick={() => setIsLike(!isLike)}
                        >
                            <span className="text-2xl">🤍</span>
                        </button>
                    )
                }
            </div>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">{recipe.description}</p>

            {/* Time */}
            <div className="flex items-center gap-2 text-gray-400 text-lg mb-6">
                <Clock size={20} />
                <span>{recipe.time} mins</span>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Ingredientes:</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.cantidad} - {ingredient.descripcion}</li>
                    ))}
                </ul>
            </div>

            {/* Steps */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-orange-300">Pasos:</h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                    {recipe.steps.map((step, index) => (
                        <li key={index} className="pb-1">{step.instruction}</li>
                    ))}
                </ol>
            </div>

            {/* Video */}
            {recipe.video_id && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-orange-300">Video de Preparación:</h2>
                    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${recipe.video_id}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-orange-300">Etiquetas:</h2>
                    <div className="flex flex-wrap gap-3">
                        {recipe.tags.map((tagObject, index) =>
                            Object.values(tagObject).map((value, valueIndex) => (
                                <span
                                    key={`${index}-${valueIndex}`}
                                    className="px-4 py-2 bg-gray-700/50 text-gray-200 rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    {value}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Recipe;