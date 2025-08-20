
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../lib/supabase';
import { createPayment } from '../lib/nivusPay';
import { toast } from 'sonner';
import { CreditCard, QrCode, User, Mail, FileText, ShoppingCart, ArrowRight, Loader2, MapPin, Home, Hash, Landmark, Globe } from 'lucide-react';

type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export function Checkout() {
  const { items, clearCart, total } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');
  // Endereço detalhado
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // step removido
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="bg-white/80 p-10 rounded-3xl shadow-2xl border border-blue-100 text-center">
          <ShoppingCart className="mx-auto mb-4 text-blue-400" size={48} />
          <div className="text-gray-500 text-lg font-semibold">Seu carrinho está vazio.</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Validação dos blocos
    if (!customerName || !customerEmail || !customerTaxId || !customerPhone) {
      toast.error('Preencha todos os dados pessoais.');
      return;
    }
    if (!addressStreet || !addressNumber || !addressNeighborhood || !addressCity || !addressState || !addressZip) {
      toast.error('Preencha todos os campos de endereço.');
      return;
    }
    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardHolderName || !cardNumber || !cardExpiry || !cardCvc) {
        toast.error('Preencha todos os dados do cartão.');
        return;
      }
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(cardExpiry)) {
        toast.error('Data de validade inválida. Use o formato MM/AA.');
        return;
      }
    }
    setIsLoading(true);
    try {
      const customerAddress = `${addressStreet}, ${addressNumber} - ${addressNeighborhood}, ${addressCity} - ${addressState}, ${addressZip}`;
      const orderItems = items.map((item: any) => ({
        order_id: '',
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total_price: item.product.price * item.quantity,
      }));
      const orderPayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_cpf: customerTaxId,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        total_amount: total,
        status: 'pending',
        order_items: orderItems,
      };
      const order = await createOrder(orderPayload as any);
      if (!order) throw new Error('Erro ao criar pedido.');
      const paymentResult = await createPayment({
        amount: total,
        customerName,
        customerEmail,
        customerCpf: customerTaxId,
        customerPhone,
        orderId: order.id,
        items: items.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        paymentMethod,
        ...(paymentMethod === 'CREDIT_CARD' && {
          creditCardToken: '',
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
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Bloco: Resumo do Pedido */}
        <div className="bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-6 md:p-8 flex flex-col gap-4 animate-fadein">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2"><ShoppingCart className="text-blue-400" />Resumo do Pedido</h2>
          <div className="divide-y divide-blue-50">
            {items.map((item: any) => (
              <div key={item.product?.id || Math.random()} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.image_url || item.product?.imageUrl || '/logo.png'}
                    alt={item.product?.name || 'Produto'}
                    className="w-14 h-14 rounded-xl object-cover border border-blue-100 shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-blue-900">{item.product?.name || 'Produto'}</p>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">{formatCurrency((item.product?.price || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-blue-900 mt-4">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Bloco: Dados Pessoais */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-6 md:p-8 flex flex-col gap-4 animate-fadein">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2"><User className="text-blue-400" />Seus Dados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Telefone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>
          </div>

          {/* Bloco: Endereço */}
          <div className="bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-6 md:p-8 flex flex-col gap-4 animate-fadein">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2"><MapPin className="text-blue-400" />Endereço de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Rua" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Número" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Bairro" value={addressNeighborhood} onChange={(e) => setAddressNeighborhood(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Cidade" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Estado" value={addressState} onChange={(e) => setAddressState(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="CEP" value={addressZip} onChange={(e) => setAddressZip(e.target.value)} className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>
          </div>

          {/* Bloco: Pagamento */}
          <div className="bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-6 md:p-8 flex flex-col gap-4 animate-fadein">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2"><CreditCard className="text-blue-400" />Pagamento</h2>
            <div className="flex gap-4 mb-2">
              <div onClick={() => setPaymentMethod('PIX')} className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'PIX' ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-blue-400'}`}>
                <QrCode size={32} className={`${paymentMethod === 'PIX' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="mt-2 font-medium">PIX</span>
              </div>
              <div onClick={() => setPaymentMethod('CREDIT_CARD')} className={`flex-1 flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'CREDIT_CARD' ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' : 'border-gray-200 hover:border-blue-400'}`}>
                <CreditCard size={32} className={`${paymentMethod === 'CREDIT_CARD' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="mt-2 font-medium">Cartão</span>
              </div>
            </div>
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-fade-in">
                <input type="text" placeholder="Nome no Cartão" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                <input type="text" placeholder="Número do Cartão" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                <input type="text" placeholder="Validade (MM/AA)" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
                <input type="text" placeholder="CVC" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            )}
          </div>

          {/* Botão Finalizar */}
          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-4 rounded-2xl shadow-xl hover:from-blue-500 hover:to-emerald-500 transition-transform transform hover:scale-105 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed animate-pop text-lg mt-2">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>Finalizar Pedido</span>
                <ArrowRight className="ml-2" size={22} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
