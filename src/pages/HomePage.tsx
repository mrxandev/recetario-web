import Hero from "../components/general/Hero"
import LatestRecipes from "../components/recipes/LatestRecipes"
import RecipesCategoryCards from "../components/recipes/RecipesCategoryCards"
import RecipesGallery from "../components/recipes/RecipesGallery"



function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Hero/>
      <RecipesGallery/>
      <RecipesCategoryCards/>
      <LatestRecipes/>
    </div>
  )
}

export default Home