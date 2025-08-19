// filepath: src/pages/Checkout.tsx
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../lib/supabase';
import { createPayment } from '../lib/nivusPay';
import { toast } from 'sonner';
import { CreditCard, QrCode, User, Mail, FileText, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';

type PaymentMethod = 'pix' | 'credit_card';

export function Checkout() {
  const { cart, clearCart, total } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      toast.error('Seu carrinho está vazio.');
      return;
    }

    if (paymentMethod === 'credit_card') {
      if (!cardHolderName || !cardNumber || !cardExpiry || !cardCvc) {
        toast.error('Por favor, preencha todos os dados do cartão.');
        return;
      }
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(cardExpiry)) {
        toast.error('Data de validade inválida. Use o formato MM/AA.');
        return;
      }
    }
 
    setIsLoading(true);

    try {
      const order = await createOrder({
        customerName,
        customerEmail,
        customerTaxId,
        items: cart,
        status: 'pending',
      });

      const [expirationMonth, expirationYear] = cardExpiry.replace(/\s/g, '').split('/');

      const paymentResult = await createPayment({
        customer: { name: customerName, email: customerEmail, taxId: customerTaxId },
        products: cart.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        order,
        paymentMethod,
        ...(paymentMethod === 'credit_card' && {
          card: {
            holderName: cardHolderName,
            number: cardNumber.replace(/\s/g, ''),
            expirationMonth,
            expirationYear: `20${expirationYear}`,
            cvv: cardCvc,
          },
        }),
      });

      if (paymentResult) {
        clearCart();
        navigate('/order-confirmation', {
          state: {
            pixCode: paymentResult.pixCode,
            pixQrCode: paymentResult.pixQrCode,
            orderId: order.id,
            paymentStatus: paymentResult.status,
          },
        });
      } else {
        throw new Error('Falha ao criar o pagamento.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Houve um erro ao processar seu pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-2 animate-fadein">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Coluna da Direita: Formulário de Checkout */}
        <div className="lg:order-last flex flex-col justify-center p-6 md:p-10 gap-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção de Dados Pessoais */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-blue-900 mb-2 tracking-tight animate-slidein">Seus Dados</h2>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Nome Completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" placeholder="E-mail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="CPF" value={customerTaxId} onChange={(e) => setCustomerTaxId(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>

            {/* Seção de Pagamento */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-blue-900 mb-2 tracking-tight animate-slidein">Pagamento</h2>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setPaymentMethod('pix')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-blue-400'}`}>
                  <QrCode size={28} className={`${paymentMethod === 'pix' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="mt-2 font-medium">PIX</span>
                </div>
                <div onClick={() => setPaymentMethod('credit_card')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-blue-400'}`}>
                  <CreditCard size={28} className={`${paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="mt-2 font-medium">Cartão</span>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-4 animate-fade-in">
                  <input type="text" placeholder="Nome no Cartão" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                  <input type="text" placeholder="Número do Cartão" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Validade (MM/AA)" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                    <input type="text" placeholder="CVC" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:from-blue-500 hover:to-emerald-500 transition-transform transform hover:scale-105 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed animate-pop">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Finalizar Compra</span>
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Coluna da Esquerda: Resumo do Pedido */}
        <div className="row-start-1 lg:row-auto mt-10 lg:mt-0 flex flex-col justify-center p-6 md:p-10">
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl shadow-xl border border-blue-100">
            <h2 className="text-2xl font-extrabold text-blue-900 flex items-center mb-6 animate-slidein">
              <ShoppingCart className="mr-3 text-gray-500" />
              Resumo do Pedido
            </h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover mr-4 border border-blue-100" />
                    <div>
                      <p className="font-semibold text-blue-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-emerald-700">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t my-6"></div>
            <div className="flex justify-between items-center text-lg font-bold text-blue-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}