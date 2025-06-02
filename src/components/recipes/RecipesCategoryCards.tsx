import { BookOpen, ChefHat, Clock, Utensils } from "lucide-react";

function RecipesCategoryCard() {
  const categories = [
    { title: "Vegetariano", description: "Explora nuestras recetas" ,icon:"fork"},
    { title: "Postres", description: "Dulces tentaciones", icon:"chef"},
    { title: "Comidas Rapidas", description: "Platos rapidos", icon:'timer'  },
    { title: "Saludable", description: "Opciones saludables y ligeras",icon:'book' },
  ];

  return (
    <>
    
      <div className="w-[90%] mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6">Categorías de Recetas</h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs h-48 bg-gray-900 rounded-2xl text-white p-6 flex flex-col justify-end items-center gap-2 hover:bg-gray-800 transition duration-300  shadow-lg hover:shadow-xl"
            >
            <p className="w-16 h-16 text-indigo-500 rounded-full p-4 bg-indigo-500/20 flex justify-center items-center"> {category.icon=="fork" ? <Utensils size={40} className="mb-2" /> : category.icon=="chef" ? <ChefHat size={40} className="mb-2" /> : category.icon=="timer" ? <Clock size={40} className="mb-2" /> : <BookOpen size={40} className="mb-2" />}</p>
              <h2 className="text-xl font-bold">{category.title}</h2>
              <p className="text-sm text-gray-300">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecipesCategoryCard;