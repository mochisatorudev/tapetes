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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}