import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus, Search } from 'lucide-react';
import { supabase, Product, Review, isSupabaseConfigured } from '../lib/supabase';
import { mockProducts, mockReviews } from '../lib/mockData';
import { useCart } from '../contexts/CartContext';

export const ProductPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
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


  // Estado para imagens: principal e secundárias
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);

  // Inicializa imagens ao carregar produto
  useEffect(() => {
    if (product) {
      setMainImage(product.image_url);
      const secondaries = [product.image_url2, product.image_url3].filter(Boolean) as string[];
      setSecondaryImages(secondaries);
    }
  }, [product?.image_url, product?.image_url2, product?.image_url3]);

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

  // Função para trocar imagem principal e secundária
  const handleSwapImage = (idx: number) => {
    if (!secondaryImages[idx] || !mainImage) return;
    const newSecondaries = [...secondaryImages];
    // Troca
    const temp = newSecondaries[idx];
    newSecondaries[idx] = mainImage;
    setMainImage(temp);
    setSecondaryImages(newSecondaries);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-2 animate-fadein">
      {/* Modal de imagem em tela cheia */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowModal(false)}>
          <img
            src={mainImage}
            alt={product.name}
            className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white"
            style={{objectFit:'contain'}}
          />
        </div>
      )}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Galeria de Imagens */}
        <div className="flex flex-row items-center justify-center p-4 md:p-8 gap-4 md:gap-8 w-full">
          {/* Imagem Principal */}
          <div className="relative w-[70%] max-w-[380px] aspect-square rounded-2xl overflow-hidden shadow-lg group min-h-[220px] bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mx-auto">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              style={{boxShadow:'0 8px 32px 0 rgba(16,185,129,0.15)'}}
            />
            <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce">NOVO</span>
            {/* Lupa */}
            <button
              className="absolute bottom-3 right-3 bg-white/80 hover:bg-white p-1 rounded-full shadow-md border border-gray-200 flex items-center justify-center z-10"
              style={{width:28, height:28}}
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
              aria-label="Ampliar imagem"
            >
              <Search className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          {/* Imagens Secundárias */}
          <div className="flex flex-col w-[30%] max-w-[120px] gap-3 md:gap-6 justify-center min-h-[220px] mx-auto">
            {secondaryImages.map((img, idx) => (
              <button
                key={idx}
                className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 ${mainImage===img?'border-emerald-500 scale-105 shadow-lg':'border-gray-200 hover:border-blue-400'}`}
                onClick={()=>handleSwapImage(idx)}
                aria-label={`Ver imagem secundária ${idx+1}`}
              >
                <img src={img} alt={product.name+" thumb"} className="w-full h-full object-cover rounded-xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="flex flex-col justify-between p-8 gap-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-2 tracking-tight animate-slidein max-w-xl w-[90%]">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-emerald-600 animate-pop">R$ {Number(product.price).toFixed(2)}</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold animate-fadein delay-200">{product.stock_quantity} disponíveis</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-blue-100 text-blue-700 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-blue-200 transition-all"
                aria-label="Diminuir quantidade"
              >
                <Minus />
              </button>
              <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                className="bg-blue-100 text-blue-700 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-blue-200 transition-all"
                aria-label="Aumentar quantidade"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
                className="btn-primary w-full py-3 text-lg rounded-xl shadow-md bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-blue-500 hover:to-emerald-500 text-white font-bold tracking-wide transform hover:scale-105 transition-all duration-300 animate-pop"
              >
                Comprar Agora
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-secondary w-full py-3 text-lg rounded-xl shadow-md bg-white border-2 border-emerald-400 text-emerald-700 font-bold tracking-wide hover:bg-emerald-50 hover:border-blue-400 transform hover:scale-105 transition-all duration-300 animate-pop flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-6 w-6" />
                Adicionar ao Carrinho
              </button>
            </div>
            {/* Descrição abaixo dos botões */}
            <div className="border-t pt-6 mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Descrição do Produto</h3>
              <p className="product-description leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <span className="text-sm text-gray-400">Categoria: <span className="text-blue-700 font-semibold">{product.category?.name}</span></span>
            <span className="text-sm text-gray-400">ID: {product.id}</span>
          </div>
        </div>
      </div>

      {/* Avaliações */}
      <div className="max-w-3xl mx-auto mt-12 bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100 animate-fadein">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <Star className="h-7 w-7 text-amber-400 animate-pop" /> Avaliações dos Clientes
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-5 shadow-md border border-blue-100 animate-fadein">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-blue-900">{review.customer_name}</span>
                  <span className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 italic">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};