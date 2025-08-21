import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockReviews } from '../lib/mockData';
import { useStore } from '../contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useStore();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchProductRating();
  }, [product.id]);

  const fetchProductRating = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock reviews data when Supabase is not configured
      const productReviews = mockReviews.filter(r => r.product_id === product.id);
      if (productReviews.length > 0) {
        const average = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length;
        setAverageRating(average);
        setReviewCount(productReviews.length);
      } else {
        // Fallback to random data if no mock reviews
        const mockRating = 4 + Math.random();
        const mockCount = Math.floor(Math.random() * 10) + 5;
        setAverageRating(mockRating);
        setReviewCount(mockCount);
      }
      return;
    }

    try {
      const { data: reviews, error } = await supabase!
        .from('reviews')
        .select('rating')
        .eq('product_id', product.id);

      if (error) throw error;

      if (reviews && reviews.length > 0) {
        const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        setAverageRating(average);
        setReviewCount(reviews.length);
      } else {
        // Fallback to mock data if no reviews found
        const mockRating = 4 + Math.random();
        const mockCount = Math.floor(Math.random() * 10) + 5;
        setAverageRating(mockRating);
        setReviewCount(mockCount);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      const mockRating = 4 + Math.random();
      const mockCount = Math.floor(Math.random() * 10) + 5;
      setAverageRating(mockRating);
      setReviewCount(mockCount);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100" style={{ minWidth: 270, maxWidth: 320, width: '100%' }}>
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-white rounded-t-2xl p-4 h-60">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain h-44 w-44 drop-shadow group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.stock_quantity < 10 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">Últimas unidades</span>
          )}
        </div>
        <div className="flex-1 flex flex-col px-5 pt-3 pb-4">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{averageRating.toFixed(1)} ({reviewCount})</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 font-semibold shadow transition-all text-sm"
            title={settings?.button_add_to_cart_text || 'Adicionar ao carrinho'}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </Link>
  );
};