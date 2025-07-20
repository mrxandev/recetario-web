import { useEffect, useState } from "react"
import { getFeaturedRecipes } from "../../services/recipes"
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
    "col-span-1 h-32 md:col-span-2 md:row-span-5 md:h-auto",
    "col-span-1 h-32 md:col-span-2 md:row-span-3 md:col-start-3 md:h-auto",
    "col-span-1 h-32 md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-4 md:h-auto",
    "col-span-1 h-32 md:col-span-1 md:row-span-3 md:col-start-5 md:row-start-1 md:h-auto",
    "col-span-1 h-32 md:col-span-1 md:row-span-2 md:col-start-5 md:row-start-4 md:h-auto",
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="relative py-8 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-[90%] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Recetas Destacadas
            </h2>
            <p className="text-gray-400 text-base md:text-lg">Descubre nuestras creaciones más populares</p>
          </div>
          <NavLink 
            to="/recetas"
            className="group flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
          >
            Ver todas
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-5 md:h-[500px]">
          {recipes.slice(0, 5).map((recipe, index) => {
            return (
              <div key={recipe.id} className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${gridClasses[index]}`}>
                <NavLink to={`/recipes/${recipe.id}`} className="block h-full w-full">
                  <div className="relative h-full w-full">
                    <img 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={recipe.image_url} 
                      alt={recipe.title} 
                    />
                    
                    {/* Overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                      <h3 className="text-white text-lg md:text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
                    </div>
                  </div>
                </NavLink>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
