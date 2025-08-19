import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { supabase, Product, Review, isSupabaseConfigured } from '../lib/supabase';
import { mockProducts, mockReviews } from '../lib/mockData';
import { useCart } from '../contexts/CartContext';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock product data.');
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        setProduct(mockProduct);
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock reviews data.');
      const productReviews = mockReviews.filter(r => r.product_id === id);
      setReviews(productReviews);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setQuantity(1);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;


  // Estado para imagem principal
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  // Só inicializa mainImage quando produto existir
  useEffect(() => {
    if (product && product.image_url) {
      setMainImage(product.image_url);
    }
  }, [product?.image_url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Produto não encontrado</h2>
          <p className="text-gray-600 mt-2">O produto que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
            {/* Galeria de Imagens do Produto */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Imagem Principal */}
              <div className="w-full sm:flex-1 aspect-square">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>
              {/* Imagens Secundárias */}
              <div className="flex sm:flex-col gap-2 sm:w-32">
                {[product.image_url, product.image_url2, product.image_url3].filter(Boolean).map((img, idx) => (
                  img && (
                    <div key={idx} className="flex-1 sm:flex-none aspect-square sm:h-[calc(50%-4px)]">
                      <img
                        src={img}
                        alt={`${product.name} - Vista ${idx+1}`}
                        className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity bg-gray-50 border border-gray-200"
                        onClick={() => setMainImage(img)}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Detalhes do Produto */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <span className="px-3 sm:px-4 py-2 font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Botões */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => {
                    addToCart(product);
                    navigate('/checkout');
                  }}
                  className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Comprar Agora
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>

              {/* Descrição do Produto */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Descrição do Produto</h3>
                <p className="product-description leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Avaliações */}
          <div className="border-t p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações dos Clientes
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {review.customer_name}
                      </h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};