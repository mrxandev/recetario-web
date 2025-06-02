import { useParams } from "react-router-dom";
import { getSpecifictRecipe } from "../../services/recipes";

function Recipe() {
    //  const recipeId='e19f6071-6b7c-49b2-8844-3647cada363b'
   const {recipeId}= useParams<{recipeId: string}>();
  getSpecifictRecipe(recipeId!)
    .then((recipe) => console.log(recipe))
    .catch((error) => console.error("Error fetching recipe:", error));

  return (
    <>
    
    </>
  )
}

export default Recipe