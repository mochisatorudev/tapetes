import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre a Loja */}
          <div>
            <h3 className="text-lg font-bold mb-4">Project Bolt</h3>
            <p className="text-gray-400">
              Sua loja de confiança para produtos inovadores e de alta qualidade.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">Sobre Nós</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contato</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Produtos</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: suporte@projectbolt.com</li>
              <li>Telefone: (11) 98765-4321</li>
              <li>Endereço: São Paulo, SP</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg font-bold mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube /></a>
            </div>
          </div>
        </div>

        {/* Ícones de Pagamento */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <h4 className="text-md font-semibold mb-4">Pagamento Seguro</h4>
          <div className="flex justify-center items-center space-x-4">
            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
            <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
            <img src="https://img.icons8.com/color/48/000000/pix.png" alt="Pix" className="h-8" />
          </div>
        </div>
      </div>
      <div className="bg-gray-900 text-center py-4">
        <p className="text-gray-500 text-sm">
          © 2024 Project Bolt. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
