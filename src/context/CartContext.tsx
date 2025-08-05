import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// Tipos
export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  cookingTime: string;
  difficulty: string;
  quantity: number;
}

export interface PurchasedRecipe {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  cookingTime: string;
  difficulty: string;
  purchaseDate: string;
  downloadUrl?: string;
}

interface CartState {
  items: CartItem[];
  purchasedRecipes: PurchasedRecipe[];
  total: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'PURCHASE_COMPLETE'; payload: PurchasedRecipe[] }
  | { type: 'LOAD_PURCHASED_RECIPES'; payload: PurchasedRecipe[] };

// Estado inicial
const initialState: CartState = {
  items: [],
  purchasedRecipes: [],
  total: 0,
  isOpen: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      // Si la receta ya existe, no agregar duplicados (solo una por receta)
      if (existingItem) {
        return state; // No cambiar nada, ya existe
      }
      
      // Agregar nueva receta con cantidad 1
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'PURCHASE_COMPLETE':
      return {
        ...state,
        items: [],
        total: 0,
        isOpen: false,
        purchasedRecipes: [...state.purchasedRecipes, ...action.payload],
      };
    
    case 'LOAD_PURCHASED_RECIPES':
      return {
        ...state,
        purchasedRecipes: action.payload,
      };
    
    default:
      return state;
  }
}

// Función auxiliar para calcular total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Contexto
interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  purchaseComplete: (items: PurchasedRecipe[]) => void;
  loadPurchasedRecipes: (recipes: PurchasedRecipe[]) => void;
  isPurchased: (recipeId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar recetas compradas al inicializar (solo una vez)
  useEffect(() => {
    const savedRecipes = localStorage.getItem('purchasedRecipes');
    if (savedRecipes) {
      try {
        const recipes = JSON.parse(savedRecipes);
        dispatch({ type: 'LOAD_PURCHASED_RECIPES', payload: recipes });
      } catch (error) {
        console.error('Error loading purchased recipes:', error);
      }
    }
  }, []); // Array vacío para que solo se ejecute una vez

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const purchaseComplete = useCallback((items: PurchasedRecipe[]) => {
    dispatch({ type: 'PURCHASE_COMPLETE', payload: items });
    // Guardar en localStorage sin depender del estado actual
    const currentPurchased = JSON.parse(localStorage.getItem('purchasedRecipes') || '[]');
    const updatedPurchased = [...currentPurchased, ...items];
    localStorage.setItem('purchasedRecipes', JSON.stringify(updatedPurchased));
  }, []);

  const loadPurchasedRecipes = useCallback((recipes: PurchasedRecipe[]) => {
    dispatch({ type: 'LOAD_PURCHASED_RECIPES', payload: recipes });
  }, []);

  const isPurchased = useCallback((recipeId: string) => {
    return state.purchasedRecipes.some(recipe => recipe.id === recipeId);
  }, [state.purchasedRecipes]);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        purchaseComplete,
        loadPurchasedRecipes,
        isPurchased,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
