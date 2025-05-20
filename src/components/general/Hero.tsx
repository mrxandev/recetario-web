import { ChefHat } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
function Hero() {
  return (
    <>
      <div className="">
        <ChefHat className="text-indigo-500" size={60} />
        <h1>Recetas UNAPEC</h1>
        <p>
          Descubre el arte de las Recetas UNAPEC con nuestras recetas
          seleccionadas
        </p>
        {/* Buttons */}
        <div className="flex flex-col gap-4">

            {/* Button more */}
          <a href="/recetas">
            <div className="flex items-center justify-center gap-2 bg-indigo-500 text-white rounded-lg p-4 hover:bg-indigo-600 transition duration-300">
              Explorar Recetas <ArrowRightIcon className="" size={20} />
            </div>
          </a>

          {/*  */}
        </div>
      </div>
    </>
  );
}

export default Hero;
