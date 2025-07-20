import { useEffect, useState } from "react"
import {  getLatestRecipes } from "../../services/recipes"
import { Clock } from "lucide-react"
import { NavLink } from "react-router-dom"

type Ingredient = {
    cantidad: string
    descripcion: string
}

type Step = {
    step: string
    instruction: string
}


type Recipe = {
    id: number
    title: string
    description: string
    ingredients: Ingredient[]
    steps: Step[]
    image_url: string
    video_id: string
    created_at: string
    time: string
    tags?: Array<{ [key: string]: string }> 
}

export default function LatestRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLatestRecipes()
            .then(setRecipes)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="relative py-20 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1200"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent mb-6">
                        Últimas Recetas
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Descubre las creaciones más recientes de nuestra comunidad de chefs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <NavLink 
                            key={recipe.id} 
                            to={`/recipes/${recipe.id}`} 
                            className="group block"
                        >
                            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2">
                                {/* Image container */}
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={recipe.image_url} 
                                        alt={recipe.title} 
                                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    
                                    {/* Time badge */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                        <Clock size={16} className="text-orange-400"/>
                                        <span>{recipe.time} min</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                                        {recipe.title}
                                    </h3>
                                    
                                    <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {recipe.description}
                                    </p>

                                    {/* Tags */}
                                    {recipe.tags && recipe.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {recipe.tags.map((tagObject, index) => (
                                                Object.values(tagObject).map((value, valueIndex) => (
                                                    <span 
                                                        key={`${index}-${valueIndex}`} 
                                                        className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full border border-indigo-500/30 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                                                    >
                                                        {value}
                                                    </span>
                                                ))
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(99,102,241,0.2)]"></div>
                                
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    )
}