import { BookOpen, ChefHat, Clock, Utensils } from "lucide-react";

function RecipesCategoryCard() {
  const categories = [
    { 
      title: "Vegetariano", 
      description: "Deliciosas opciones plant-based",
      icon: "fork",
      gradient: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      bgGradient: "from-emerald-600 to-green-600"
    },
    { 
      title: "Postres", 
      description: "Dulces tentaciones irresistibles",
      icon: "chef",
      gradient: "from-pink-500/20 to-rose-500/20", 
      iconColor: "text-pink-400",
      bgGradient: "from-pink-600 to-rose-600"
    },
    { 
      title: "Comidas Rápidas", 
      description: "Platos rápidos y sabrosos",
      icon: 'timer',
      gradient: "from-orange-500/20 to-amber-500/20",
      iconColor: "text-orange-400", 
      bgGradient: "from-orange-600 to-amber-600"
    },
    { 
      title: "Saludable", 
      description: "Opciones nutritivas y balanceadas",
      icon: 'book',
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
      bgGradient: "from-blue-600 to-indigo-600"
    },
  ];

  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1500"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Categorías de Recetas
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explora nuestras diferentes categorías y encuentra la receta perfecta para cada ocasión
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon container */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float`}>
                  {category.icon === "fork" ? (
                    <Utensils size={32} className={category.iconColor} />
                  ) : category.icon === "chef" ? (
                    <ChefHat size={32} className={category.iconColor} />
                  ) : category.icon === "timer" ? (
                    <Clock size={32} className={category.iconColor} />
                  ) : (
                    <BookOpen size={32} className={category.iconColor} />
                  )}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {category.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {category.description}
                </p>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipesCategoryCard;