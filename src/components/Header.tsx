// filepath: src/components/Header.tsx


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';


export function Header() {
  const { items } = useCart();
  const cartItemCount = (items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  const { settings } = useStore();



  // Banner dinâmico: usa o header_banner_url se existir, senão banner_url, senão fallback
  const bannerUrl = settings?.header_banner_url || settings?.banner_url || '/banner.jpg';
  // Logo dinâmica: usa logo_url das configurações, senão fallback
  const logoUrl = settings?.logo_url || '/logo.png';

  // Estado de carregamento do banner
  const [bannerLoaded, setBannerLoaded] = useState(false);

  return (
    <>
      {/* Banner dinâmico da loja */}
      <div className="w-full m-0 p-0" style={{margin:0,padding:0}}>
        {!bannerLoaded && (
          <div className="w-full flex items-center justify-center bg-gray-100 animate-pulse" style={{height:80,minHeight:80}}>
            <span className="text-xs text-gray-400">Carregando banner...</span>
          </div>
        )}
        <div className="w-full overflow-hidden m-0 p-0">
          <img
            src={bannerUrl}
            alt="Banner da loja"
            className="block w-full m-0 p-0 border-0 object-contain md:object-cover"
            style={{
              width: '100%',
              maxWidth: '100vw',
              minHeight: 50,
              maxHeight: 120,
              height: 'auto',
              margin: 0,
              padding: 0,
              objectFit: 'contain',
              objectPosition: 'top',
              background: '#fff',
              display: 'block',
              border: 'none',
              boxShadow: 'none',
            }}
            onLoad={() => setBannerLoaded(true)}
            onError={() => setBannerLoaded(true)}
            draggable={false}
          />
        </div>
      </div>
  <header className="bg-white shadow-md sticky top-0 z-40 m-0 pt-2 pb-2" style={{margin:0,paddingTop:'0.5rem',paddingBottom:'0.5rem'}}>
        <div className="container mx-auto px-0 py-4 flex justify-between items-center m-0" style={{margin:0}}>
          {/* Logo da loja */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-8 w-auto sm:h-10 mr-2" 
              style={{maxHeight:32, height:'2rem'}}
            />
            {/* Se quiser texto junto da logo, descomente a linha abaixo */}
            {/* <span className="text-2xl font-bold text-gray-800">Sua Loja</span> */}
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/cart" className="relative flex items-center justify-center h-10 w-10">
              <ShoppingCart className="text-gray-600 hover:text-blue-600 h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}