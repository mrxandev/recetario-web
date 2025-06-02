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


    if (loading) return <p className="text-center mt-4">Cargando recetas destacadas...</p>

    return (
        <>
            <div className="w-[90%]  mx-auto p-4 ">
                <h1 className="text-2xl font-bold mb-8 mt-4">Últimas Recetas</h1>

                <div className="flex flex-wrap gap-8 justify-center">
                {
                    recipes.map((recipe) => (
                        <NavLink key={recipe.id} to={`/recipes/${recipe.id}`} className="no-underline">
                        <div key={recipe.id} className="max-w-[300px] md:min-w-[420px] bg-gray-900/50 shadow-md rounded-2xl mb-4">
                            <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover rounded mb-2" />
                            <div className="p-4 text-white">
                                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                                <p className="text-gray-300 mb-2">{recipe.description}</p>
                                <div className="flex gap-1 items-center mb-2">
                                    <Clock size={15}/>
                                    <p className="flex items-center gap-0.5 text-sm text-gray-300"> {recipe.time}<span>mins</span></p>
                                </div>

                                
                                <div className="">
                                   
                                    {recipe.tags && recipe.tags.length > 0 && (
                                        <>
                                            <ul className="flex text-gray-300">
                                                {
                                                   
                                                    recipe.tags.map((tagObject, index) => (
                                 
                                                        Object.values(tagObject).map((value, valueIndex) => (
                                                            <li className="w-fit p-2 px-4 bg-gray-800/30 rounded-full text-xs font-bold" key={`${index}-${valueIndex}`}>{value}</li>
                                                        ))
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        </NavLink>
                    ))
                }
                </div>
            </div>
        </>
    )
}