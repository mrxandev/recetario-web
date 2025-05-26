import { useEffect, useState } from "react"
import { getFeaturedRecipes } from "../../services/recipes" 

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
  tags?: Array<{ [key: number]: string }>
}

export default function RecipesGallery() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedRecipes()
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const gridClasses = [
    "col-span-3 md:col-span-2 md:row-span-5",
    "col-span-3 md:col-span-2 md:row-span-3 md:col-start-3",
    "col-span-3 md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-4",
    "col-span-3 md:col-span-1 row-span-3 md:col-start-5 md:row-start-1",
    "col-span-3 md:col-span-1 row-span-2 md:col-start-5 md:row-start-4",
  ]

  if (loading) return <p className="text-center mt-4">Cargando recetas destacadas...</p>

  return (
    <div className="w-[90%] mx-auto mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recetas Destacadas</h2>
        <a className="flex gap-2 text-indigo-700 cursor-pointer">Ver todas</a>
      </div>

      <div className="grid md:grid-cols-5 md:grid-rows-5 gap-4 mt-8 md:max-h-[500px]">
        {recipes.map((recipe, index) => {
    
          return (
            <div key={recipe.id} className={`rounded-2xl brightness-50 hover:brightness-105 transition-all duration-400 bg-indigo-${300 + index * 100} ${gridClasses[index]}`}>
              <div className="relative h-full w-full">
                <img className="rounded-2xl object-cover w-full h-full" src={recipe.image_url} alt={recipe.title} />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-3xl  font-bold tracking-tight">{recipe.title}</h3>
             
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
