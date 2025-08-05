import { useState } from 'react';
import { X, CreditCard, Lock, Calendar, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { state, purchaseComplete } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: user?.email || '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'México'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Fecha de vencimiento inválida';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Nombre del titular requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido';
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Dirección requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Ciudad requerida';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Código postal requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Formulario incompleto', 'Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);

    // Simular proceso de pago
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay de procesamiento

      // Crear items comprados
      const purchasedItems = state.items.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        category: item.category,
        cookingTime: item.cookingTime,
        difficulty: item.difficulty,
        purchaseDate: new Date().toISOString(),
        downloadUrl: `/downloads/${item.id}.pdf`,
      }));

      purchaseComplete(purchasedItems);
      
      showNotification(
        'success', 
        '¡Pago procesado exitosamente!', 
        `Has comprado ${purchasedItems.length} receta(s) por $${state.total.toFixed(2)}`
      );
      
      onClose();
    } catch (error) {
      showNotification('error', 'Error en el pago', 'Hubo un problema procesando tu pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Información de Pago</h2>
                <p className="text-gray-400 text-sm">Total: ${state.total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información de la tarjeta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-400" />
                Información de la Tarjeta
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de Tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                      {getCardType(formData.cardNumber)}
                    </div>
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.expiryDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.cvv ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.cvv && (
                    <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Titular
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.cardName ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.cardName && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de facturación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Información de Facturación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="Calle 123, Colonia Centro"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.billingAddress ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.billingAddress && (
                    <p className="text-red-400 text-sm mt-1">{errors.billingAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ciudad de México"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.city ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="01000"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.zipCode && (
                    <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Resumen del Pedido</h4>
              <div className="space-y-2 text-sm">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-300">
                    <span>{item.title} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pagar ${state.total.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Seguridad */}
            <div className="text-center text-sm text-gray-400">
              <p className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                Tu información está protegida con encriptación SSL
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
