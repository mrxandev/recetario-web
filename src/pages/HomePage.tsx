import Hero from "../components/general/Hero"
import LatestRecipes from "../components/recipes/LatestRecipes"
import Recipe from "../components/recipes/Recipe"
import RecipesCategoryCards from "../components/recipes/RecipesCategoryCards"
import RecipesGallery from "../components/recipes/RecipesGallery"



function Home() {
  return (
  <>

<Hero/>
<RecipesGallery/>
<RecipesCategoryCards/>
<LatestRecipes/>
<Recipe/>



  </>

  )
}

export default Home