import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

export const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { settings } = useStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 text-[#2563eb] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#2563eb] mb-2">
            {settings?.message_empty_cart_text || 'Seu carrinho está vazio'}
          </h2>
          <p className="text-gray-600 mb-6 text-base">Adicione alguns produtos para começar suas compras!</p>
          <Link
            to="/"
            className="bg-[#2563eb] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-[#1d4ed8] transition"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8ff] py-8 font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#2563eb] mb-6 sm:mb-8">Carrinho de Compras</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xs sm:text-base font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-xs sm:text-sm product-price">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <span className="w-8 sm:w-12 text-center font-semibold text-xs sm:text-base">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-base font-semibold product-price">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors mt-1"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#e0e7ef] p-4 sm:p-6 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base sm:text-lg font-semibold text-[#2563eb]">Total:</span>
              <span className="text-lg sm:text-xl font-bold product-price">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="bg-white border border-[#2563eb] text-[#2563eb] flex-1 py-2 px-4 sm:px-6 text-center text-xs sm:text-base rounded-full font-bold hover:bg-[#2563eb] hover:text-white transition"
              >
                {settings?.button_continue_shopping_text || 'Continuar Comprando'}
              </Link>
              <Link
                to="/checkout"
                className="bg-[#2563eb] text-white flex-1 py-2 px-4 sm:px-6 text-center text-xs sm:text-base rounded-full font-bold hover:bg-[#1d4ed8] transition"
              >
                {settings?.button_checkout_text || 'Finalizar Pedido'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};