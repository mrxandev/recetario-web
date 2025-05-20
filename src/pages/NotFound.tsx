
import { ChefHat, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Ícono */}
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
        <div className="relative bg-card rounded-full p-8 shadow-lg">
          <ChefHat className="h-24 w-24 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Texto principal */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">¡Receta no encontrada!</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Parece que esta receta se ha quemado o nunca existió en nuestra cocina.
      </p>



      {/* Enlaces de acción */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg transition-colors"
        >
          <Home className="h-5 w-5" />
          Volver al inicio
        </a>
   
      </div>

      {/* Mensajes */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="font-medium mb-1">¿Buscabas algún plato?</h3>
          <p className="text-sm text-muted-foreground">Explora nuestra colección</p>
        </div>
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="font-medium mb-1">Recetas populares</h3>
          <p className="text-sm text-muted-foreground">Descubre lo que cocinamos</p>
        </div>
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="font-medium mb-1">Recetas rápidas</h3>
          <p className="text-sm text-muted-foreground">Listas en menos de 30 minutos</p>
        </div>
      </div>
    </div>
  )
}
