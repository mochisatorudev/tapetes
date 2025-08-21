// filepath: src/pages/Product.tsx
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { supabase, Product } from '../lib/supabase';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (!error && data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f8ff] font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-[#2563eb] tracking-tight" style={{ fontFamily: `'Playfair Display', serif` }}>Produtos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}