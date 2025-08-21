// ...existing code...
// Removido código duplicado fora do componente
// ...existing code...
// ...existing code...
// ...existing code...

import React, { useState, useEffect } from 'react';
// Import Google Fonts elegant
import '../index.css';
import { Link } from 'react-router-dom';
import { Store, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, Product, Category, isSupabaseConfigured, getSupabaseStatus } from '../lib/supabase';
import { mockProducts, mockCategories } from '../lib/mockData';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../contexts/StoreContext';

export const Home: React.FC = () => {
  const { settings } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  // carouselRef removido pois não está em uso

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Debug Supabase configuration in development
    if (import.meta.env.DEV) {
      console.log('🔧 Supabase Status:', getSupabaseStatus());
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase não configurado. Usando dados de demonstração.');
        console.info('📖 Veja SUPABASE_INTEGRATION.md para instruções de configuração.');
      }
    }
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock product data.');
      setProducts(mockProducts);
      setLoading(false);
      return;
    }

    try {
      if (!supabase) throw new Error('Supabase não configurado');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Fallback para dados mock em caso de erro
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock category data.');
      setCategories(mockCategories);
      return;
    }

    try {
      if (!supabase) throw new Error('Supabase não configurado');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para dados mock em caso de erro
      setCategories(mockCategories);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  const scrollContainer = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  // ...mantém apenas a versão mais moderna e elegante dos blocos (já presente após a duplicidade)...
  if (!settings) {
    // fallback visual mínimo caso settings não esteja carregado
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff] font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
        <span className="text-2xl text-blue-700 font-bold">Carregando loja...</span>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f5f8ff] font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
      {/* HERO INOVADOR */}
      <section
        className="relative text-white py-20 sm:py-32 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-emerald-500 to-blue-400"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none animate-fadein" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center animate-fadein">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            {settings?.welcome_message || `Sua casa, seu estilo.`}
          </h1>
          <p className="text-xl sm:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            {settings?.store_description || 'Tapetes e capachos modernos para transformar ambientes.'}
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-lg font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:bg-gray-100 transition-all duration-300"
            style={{ color: settings?.primary_color || '#3b82f6' }}
          >
            Ver Produtos
          </Link>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-200" />
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="categories-container">
            <div className="categories-scroll">
              <button
                onClick={() => setSelectedCategory('all')}
                className="category-button"
                style={
                  selectedCategory === 'all'
                    ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                    : { backgroundColor: '#e5e7eb', color: '#374151' }
                }
              >
                Todos os Produtos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="category-button"
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                      : { backgroundColor: '#e5e7eb', color: '#374151' }
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Produtos Inovador */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight animate-fadein">Descubra nossos destaques</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto em destaque.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Mais Vendidos</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollContainer('products-carousel', 'left')}
                    className="scroll-button"
                    style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => scrollContainer('products-carousel', 'right')}
                    className="scroll-button"
                    style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div
                id="products-carousel"
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              >
                {filteredProducts.slice(0, 12).map((product, idx) => (
                  <div
                    key={product.id}
                    className="relative min-w-[240px] max-w-[260px] w-full bg-white rounded-2xl shadow-lg p-2 flex flex-col items-stretch justify-between transition-transform duration-200 hover:scale-105 group snap-center"
                    style={{ flex: '0 0 240px' }}
                  >
                    {idx < 3 && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce">NOVO</span>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/products"
                  className="text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors inline-block hover:scale-105"
                  style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Banner extra */}
      <section className="py-10 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 animate-fadein">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 text-emerald-700">Compre com tranquilidade</h3>
            <p className="text-lg text-gray-700 mb-4">Produtos selecionados, entrega rápida e suporte humanizado. Sua experiência é prioridade!</p>
            <Link to="/faq" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-emerald-700 transition">Dúvidas? Veja o FAQ</Link>
          </div>
          <img src="/banner.jpg" alt="Banner" className="w-64 h-40 object-cover rounded-xl shadow-lg border border-emerald-100" />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">O que nossos clientes dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“Amei a qualidade e a entrega foi super rápida! Recomendo demais.”</p>
              <span className="text-emerald-600 font-bold">Juliana S.</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein delay-100">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“Atendimento excelente e produtos lindos. Voltarei a comprar!”</p>
              <span className="text-blue-600 font-bold">Carlos M.</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein delay-200">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“O site é fácil de navegar e o capacho ficou perfeito na minha porta!”</p>
              <span className="text-pink-600 font-bold">Renata F.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="text-white py-12 mt-16"
        style={{ backgroundColor: settings?.text_color || '#111827' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Informações da Loja */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {settings?.logo_url ? (
                  <img 
                    src={settings.logo_url!} 
                    alt={settings.store_name!}
                    className="h-8 sm:h-12 w-auto max-w-32 sm:max-w-48 object-contain"
                  />
                ) : (
                  <Store className="h-8 w-8" style={{ color: settings?.primary_color || '#3b82f6' }} />
                )}
                <span className="text-xl font-bold">{settings?.store_name}</span>
              </div>
              <p className="text-gray-300 mb-4">{settings?.store_description}</p>
              {settings?.contact_address && (
                <p className="text-gray-400 text-sm">{settings.contact_address!}</p>
              )}
            </div>

            {/* Contato */}
            {(settings?.contact_phone || settings?.contact_email || settings?.contact_whatsapp) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <div className="space-y-2 text-gray-300">
                  {settings?.contact_phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{settings.contact_phone!}</span>
                    </p>
                  )}
                  {settings?.contact_email && (
                    <p className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{settings.contact_email!}</span>
                    </p>
                  )}
                  {settings?.contact_whatsapp && (
                    <p className="text-sm">WhatsApp: {settings.contact_whatsapp!}</p>
                  )}
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {(settings?.facebook_url || settings?.instagram_url || settings?.twitter_url) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  {settings?.facebook_url && (
                    <a 
                      href={settings.facebook_url!}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {settings?.instagram_url && (
                    <a 
                      href={settings.instagram_url!}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings?.twitter_url && (
                    <a 
                      href={settings.twitter_url!}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">{settings.footer_text!}</p>
          </div>
        </div>
      </footer>
    </div>
  );

      {/* HERO INOVADOR */}
      <section
        className="relative text-white py-20 sm:py-32 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-emerald-500 to-blue-400"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none animate-fadein" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center animate-fadein">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            {settings?.welcome_message || `Sua casa, seu estilo.`}
          </h1>
          <p className="text-xl sm:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            {settings?.store_description || 'Tapetes e capachos modernos para transformar ambientes.'}
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-lg font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:bg-gray-100 transition-all duration-300"
            style={{ color: settings?.primary_color || '#3b82f6' }}
          >
            Ver Produtos
          </Link>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-200" />
      </section>


  {/* Benefícios rápidos removidos */}

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="categories-container">
            <div className="categories-scroll">
              <button
                onClick={() => setSelectedCategory('all')}
                className="category-button"
                style={
                  selectedCategory === 'all'
                    ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                    : { backgroundColor: '#e5e7eb', color: '#374151' }
                }
              >
                Todos os Produtos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="category-button"
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                      : { backgroundColor: '#e5e7eb', color: '#374151' }
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Carrossel de Produtos Inovador */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight animate-fadein">Descubra nossos destaques</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto em destaque.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Mais Vendidos</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollContainer('products-carousel', 'left')}
                    className="scroll-button"
                    style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => scrollContainer('products-carousel', 'right')}
                    className="scroll-button"
                    style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div
                id="products-carousel"
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              >
                {filteredProducts.slice(0, 12).map((product, idx) => (
                  <div
                    key={product.id}
                    className="relative min-w-[240px] max-w-[260px] w-full bg-white rounded-2xl shadow-lg p-2 flex flex-col items-stretch justify-between transition-transform duration-200 hover:scale-105 group snap-center"
                    style={{ flex: '0 0 240px' }}
                  >
                    {idx < 3 && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce">NOVO</span>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/products"
                  className="text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors inline-block hover:scale-105"
                  style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Banner extra */}
      <section className="py-10 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 animate-fadein">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 text-emerald-700">Compre com tranquilidade</h3>
            <p className="text-lg text-gray-700 mb-4">Produtos selecionados, entrega rápida e suporte humanizado. Sua experiência é prioridade!</p>
            <Link to="/faq" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-emerald-700 transition">Dúvidas? Veja o FAQ</Link>
          </div>
          <img src="/banner.jpg" alt="Banner" className="w-64 h-40 object-cover rounded-xl shadow-lg border border-emerald-100" />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">O que nossos clientes dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“Amei a qualidade e a entrega foi super rápida! Recomendo demais.”</p>
              <span className="text-emerald-600 font-bold">Juliana S.</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein delay-100">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“Atendimento excelente e produtos lindos. Voltarei a comprar!”</p>
              <span className="text-blue-600 font-bold">Carlos M.</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow text-center flex flex-col items-center animate-fadein delay-200">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Cliente" className="w-16 h-16 rounded-full mb-3" />
              <p className="text-gray-700 italic mb-2">“O site é fácil de navegar e o capacho ficou perfeito na minha porta!”</p>
              <span className="text-pink-600 font-bold">Renata F.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="text-white py-12 mt-16"
        style={{ backgroundColor: settings?.text_color || '#111827' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Informações da Loja */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {settings?.logo_url ? (
                  <img 
                    src={settings?.logo_url || ''}
                    alt={settings?.store_name || 'Logo'}
                    className="h-8 sm:h-12 w-auto max-w-32 sm:max-w-48 object-contain"
                  />
                ) : (
                  <Store className="h-8 w-8" style={{ color: settings?.primary_color || '#3b82f6' }} />
                )}
                <span className="text-xl font-bold">{settings?.store_name}</span>
              </div>
              <p className="text-gray-300 mb-4">{settings?.store_description}</p>
              {settings?.contact_address && (
                <p className="text-gray-400 text-sm">{settings?.contact_address || ''}</p>
              )}
            </div>

            {/* Contato */}
            {(settings?.contact_phone || settings?.contact_email || settings?.contact_whatsapp) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <div className="space-y-2 text-gray-300">
                  {settings?.contact_phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{settings?.contact_phone || ''}</span>
                    </p>
                  )}
                  {settings?.contact_email && (
                    <p className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{settings?.contact_email || ''}</span>
                    </p>
                  )}
                  {settings?.contact_whatsapp && (
                    <p className="text-sm">WhatsApp: {settings?.contact_whatsapp || ''}</p>
                  )}
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {(settings?.facebook_url || settings?.instagram_url || settings?.twitter_url) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  {settings?.facebook_url && (
                    <a 
                      href={settings?.facebook_url || '#'}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {settings?.instagram_url && (
                    <a 
                      href={settings?.instagram_url || '#'}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings?.twitter_url && (
                    <a 
                      href={settings?.twitter_url || '#'}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">{settings?.footer_text || ''}</p>
          </div>
        </div>
      </footer>
    </div>
  );