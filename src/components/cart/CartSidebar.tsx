import { X, ShoppingBag, CreditCard, Trash2, LogIn } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useState } from 'react';
import PaymentModal from './PaymentModal';
import { Link } from 'react-router-dom';

export default function CartSidebar() {
  const { state, removeFromCart, toggleCart, clearCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = () => {
    if (state.items.length === 0) {
      showNotification('warning', 'Carrito vacío', 'Agrega algunas recetas al carrito primero');
      return;
    }

    if (!user) {
      showNotification('warning', 'Inicia sesión requerida', 'Debes iniciar sesión para realizar una compra');
      return;
    }

    setShowPaymentModal(true);
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-gray-900 shadow-2xl z-50 transform transition-transform border-l border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            Carrito ({state.items.length} receta{state.items.length !== 1 ? 's' : ''})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ height: 'calc(100vh - 180px)' }}>
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mt-2">Puedes agregar varias recetas diferentes (1 unidad por receta)</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-indigo-400">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium px-3 py-1 bg-gray-800 rounded-lg">
                            1 unidad
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-900/50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-700 p-4 sm:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-indigo-400">
                ${state.total.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              {!user ? (
                <Link
                  to="/login"
                  onClick={toggleCart}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Inicia Sesión para Comprar
                </Link>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Comprar Ahora
                </button>
              )}
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 rounded-lg transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Pago */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
}
