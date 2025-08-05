import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecifictRecipe } from "../../services/recipes";
import { addToFavorites, removeFromFavorites, isFavorite } from "../../services/favorites";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { Clock, Heart, ChefHat, PlayCircle, Tag } from "lucide-react";
import AddToCartButton from "../cart/AddToCartButton";


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
    const { user } = useAuth();
    const { showNotification } = useNotification();

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
                    
                    // Check if this recipe is already in user's favorites
                    if (user) {
                        return isFavorite(user.id, idAsNumber);
                    }
                    return false;
                })
                .then((favoriteStatus) => {
                    setIsLike(favoriteStatus);
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
    }, [recipeId, user]);

    const handleLikeToggle = async () => {
        if (!user || !recipe) {
            showNotification(
                'warning',
                'Inicio de sesión requerido',
                'Debes iniciar sesión para agregar recetas a favoritos'
            );
            return;
        }

        try {
            if (isLike) {
                await removeFromFavorites(user.id, recipe.id);
                setIsLike(false);
                showNotification(
                    'info',
                    'Eliminado de favoritos',
                    `"${recipe.title}" ha sido eliminada de tus favoritos`
                );
            } else {
                await addToFavorites(user.id, recipe.id);
                setIsLike(true);
                showNotification(
                    'success',
                    'Agregado a favoritos',
                    `"${recipe.title}" ha sido agregada a tus favoritos`
                );
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            showNotification(
                'error',
                'Error al actualizar favoritos',
                'No se pudo actualizar la lista de favoritos. Inténtalo de nuevo.'
            );
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
                    <p className="text-gray-400 text-lg">Cargando receta...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-white mb-2">¡Oops!</h2>
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Receta no encontrada</h2>
                    <p className="text-gray-400 mb-4">La receta que buscas no existe o ha sido eliminada.</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-950">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                {/* Hero Section with Image */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-[60vh] md:h-[70vh] object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Content over image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                                    {recipe.title}
                                </h1>
                                <p className="text-xl text-gray-200 mb-6 leading-relaxed max-w-2xl">
                                    {recipe.description}
                                </p>
                                
                                {/* Time badge */}
                                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full w-fit">
                                    <Clock className="text-orange-400" size={20} />
                                    <span className="text-white font-medium">{recipe.time} minutos</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {/* Add to Cart Button */}
                                <AddToCartButton
                                    recipe={{
                                        id: recipe.id.toString(),
                                        title: recipe.title,
                                        image: recipe.image_url,
                                        category: recipe.tags?.[0] ? Object.values(recipe.tags[0])[0] : 'Recetas',
                                        cookingTime: `${recipe.time} min`,
                                        difficulty: 'Medio',
                                    }}
                                    price={12.99}
                                    isPremium={true}
                                    className="w-full sm:w-auto"
                                />

                                {/* Favorite button */}
                                <button
                                    onClick={handleLikeToggle}
                                    className={`p-4 rounded-full backdrop-blur-sm border-2 transition-all duration-300 transform hover:scale-110 ${
                                        isLike 
                                            ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                                            : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400'
                                    }`}
                                >
                                    <Heart size={28} fill={isLike ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Ingredients Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl">
                                    <ChefHat className="text-emerald-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Ingredientes</h2>
                            </div>
                            
                            <ul className="space-y-4">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="text-emerald-300 font-medium">{ingredient.cantidad}</span>
                                            <span className="text-gray-300 ml-2">{ingredient.descripcion}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                                    <span className="text-2xl">👨‍🍳</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Preparación</h2>
                            </div>
                            
                            <div className="space-y-6">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <p className="text-gray-300 leading-relaxed text-lg">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video Section */}
                        {recipe.video_id && (
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
                                        <PlayCircle className="text-red-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Video Tutorial</h2>
                                </div>
                                
                                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${recipe.video_id}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Tags Section */}
                        {recipe.tags && recipe.tags.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
                                        <Tag className="text-orange-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Etiquetas</h2>
                                </div>
                                
                                <div className="flex flex-wrap gap-3">
                                    {recipe.tags.map((tagObject, index) =>
                                        Object.values(tagObject).map((value, valueIndex) => (
                                            <span
                                                key={`${index}-${valueIndex}`}
                                                className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30 hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 cursor-default"
                                            >
                                                #{value}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recipe;