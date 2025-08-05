import { ShoppingCart, CheckCircle, Crown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

interface AddToCartButtonProps {
  recipe: {
    id: string;
    title: string;
    image: string;
    category: string;
    cookingTime: string;
    difficulty: string;
  };
  price?: number;
  isPremium?: boolean;
  className?: string;
}

export default function AddToCartButton({ 
  recipe, 
  price = 9.99, 
  isPremium = false,
  className = "" 
}: AddToCartButtonProps) {
  const { addToCart, isPurchased, state } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const isInCart = state.items.some(item => item.id === recipe.id);

  const handleAddToCart = () => {
    if (isInCart) {
      showNotification('info', 'Ya está en el carrito', 'Esta receta ya está en tu carrito de compras');
      return;
    }

    if (!user) {
      showNotification('warning', 'Inicia sesión requerida', 'Debes iniciar sesión para agregar recetas al carrito');
      return;
    }

    addToCart({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      price: price,
      category: recipe.category,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
    });

    showNotification('success', 'Agregado al carrito', `${recipe.title} ha sido agregada al carrito`);
  };

  if (isPurchased(recipe.id)) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 text-green-400 rounded-lg font-medium cursor-not-allowed ${className}`}
      >
        <CheckCircle className="h-4 w-4" />
        Ya Comprada
      </button>
    );
  }

  if (isInCart) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700 text-blue-400 rounded-lg font-medium cursor-not-allowed ${className}`}
      >
        <ShoppingCart className="h-4 w-4" />
        En el Carrito
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-indigo-500/25 ${className}`}
    >
      {isPremium && <Crown className="h-4 w-4 text-yellow-400" />}
      <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span>${price.toFixed(2)}</span>
    </button>
  );
}
