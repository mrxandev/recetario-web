import { ArrowRight } from "lucide-react"

function RecipesGallery() {
  return (
  <>
  <div className="w-[90%] mx-auto">
<div className="flex justify-between items-center">
    <h2>Recetas Destacadas</h2>
    <a className="flex gap-2 text-indigo-700 cursor-pointer">Ver todas <ArrowRight/></a>
    </div>
<div className="grid md:grid-cols-5 md:grid-rows-5 gap-4">
    <div className="col-span-3 md:col-span-2 md:row-span-5 bg-indigo-300">1</div>
    <div className="col-span-3 md:col-span-2 md:row-span-3 md:col-start-3 bg-indigo-400">2</div>
    <div className="col-span-3 md:row-span-2 md:col-start-3 md:row-start-4 bg-indigo-500">3</div>
    <div className="col-span-3 md:col-span-1 row-span-3 md:col-start-5 md:row-start-1 bg-indigo-600">4</div>
</div>
    
  </div>
  </>
  )
}

export default RecipesGallery