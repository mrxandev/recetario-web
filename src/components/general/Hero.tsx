import { ChefHat } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
function Hero() {
  return (
    <>
    <div className="flex justify-center items-center">
      <div className="w-[90%] flex flex-col items-center text-center bg-linear-to-br from-purple-950/60 to-gray-950 p-16 mt-16 gap-8 rounded-3xl">
        <ChefHat className="text-indigo-500" size={70} />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight ">
          Recetas UNAPEC
        </h1>
        <p className="text-xl text-white/75 max-w-2xl mx-auto ">
          Descubre el arte de la cocina con nuestras recetas cuidadosamente
          seleccionadas para cada ocasión y gusto
        </p>
        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center  ">
          {/* Button more */}
          <a href="/recetas">
            <div className="w-52 h-12 flex items-center justify-center gap-2 bg-purple-700 text-white rounded-lg p-4 hover:bg-purple-800 transition duration-400">
              Explorar Recetas <ArrowRightIcon className="" size={20} />
            </div>
          </a>
          {/* Button popular */}
          <a href="/popular">
            <div className="w-48 h-12 flex items-center justify-center gap-2 bg-gray-950 text-white rounded-lg p-4 border border-white/10 hover:bg-purple-950 transition duration-400">
              Explorar Recetas
            </div>
          </a>
        </div>
      </div>
      </div>
    </>
  );
}

export default Hero;
