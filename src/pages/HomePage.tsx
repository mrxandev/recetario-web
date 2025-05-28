import Hero from "../components/general/Hero"
import LatestRecipes from "../components/recipes/LatestRecipes"
import RecipesCategoryCards from "../components/recipes/RecipesCategoryCards"
import RecipesGallery from "../components/recipes/RecipesGallery"



function Home() {
  return (
  <>

<Hero/>
<RecipesGallery/>
<RecipesCategoryCards/>
<LatestRecipes/>



  </>

  )
}

export default Home