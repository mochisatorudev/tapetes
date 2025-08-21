import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, Home, ShoppingBag, Star } from 'lucide-react';
import { checkPaymentStatus } from '../lib/nivusPay';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../contexts/StoreContext';

export const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useStore();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    verifyPaymentAndOrder();
  }, [orderId, paymentId]);

  const verifyPaymentAndOrder = async () => {
    try {
      console.log('🔄 Verificando pagamento e pedido...');
      
      // Buscar dados do pedido
      if (isSupabaseConfigured() && supabase) {
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products(*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrderData(order);

        // Se tem payment_id, verificar status do pagamento
        if (paymentId && order.payment_id) {
          try {
            const paymentStatus = await checkPaymentStatus(order.payment_id);
            console.log('💳 Status do pagamento:', paymentStatus);

            // Verificar se foi aprovado
            if (paymentStatus.status === 'approved' || paymentStatus.status === 'paid') {
              setPaymentVerified(true);
              
              // Atualizar status do pedido para confirmado
              await supabase
                .from('orders')
                .update({ 
                  status: 'confirmed',
                  payment_status: 'paid'
                })
                .eq('id', orderId);
                
              console.log('✅ Pagamento aprovado e pedido confirmado!');
            }
          } catch (paymentError) {
            console.warn('⚠️ Erro ao verificar pagamento:', paymentError);
            // Continuar mesmo se não conseguir verificar o pagamento
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-[#2563eb] mb-2">Verificando seu pagamento...</h2>
          <p className="text-gray-600">Aguarde enquanto confirmamos seu pedido</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] flex items-center justify-center font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-[#2563eb] mb-2">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-6">Não foi possível encontrar os dados do seu pedido.</p>
          <Link
            to="/"
            className="bg-[#2563eb] text-white py-2 px-6 rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            Voltar à Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {paymentVerified ? 'Pagamento Aprovado!' : 'Pedido Recebido!'}
          </h1>
          <p className="text-lg text-gray-600">
            {paymentVerified 
              ? 'Seu pagamento foi processado com sucesso e seu pedido está confirmado.'
              : 'Recebemos seu pedido e você receberá atualizações por email.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Pedido</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Número do Pedido</p>
                  <p className="text-lg font-semibold text-gray-900">#{orderData.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data do Pedido</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(orderData.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    paymentVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {paymentVerified ? 'Confirmado' : 'Aguardando Pagamento'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold product-price">
                    R$ {Number(orderData.total_amount).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações de Entrega</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{orderData.customer_name}</p>
                  <p className="text-gray-600">{orderData.customer_email}</p>
                  <p className="text-gray-600 mt-2">{orderData.customer_address}</p>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {orderData.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium product-price">
                        R$ {(item.quantity * Number(item.price)).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar com Próximos Passos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Passos</h3>
              
              <div className="space-y-4">
                {paymentVerified ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Pagamento Confirmado</p>
                        <p className="text-sm text-gray-600">Seu pagamento foi processado com sucesso</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Preparando Pedido</p>
                        <p className="text-sm text-gray-600">Seu pedido está sendo preparado para envio</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Envio</p>
                        <p className="text-sm text-gray-600">Você receberá o código de rastreamento em breve</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Aguardando Pagamento</p>
                      <p className="text-sm text-gray-600">Complete o pagamento para confirmar seu pedido</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimativa de Entrega */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Entrega Estimada</span>
                </div>
                <p className="text-sm text-blue-700">
                  {paymentVerified 
                    ? `${settings?.estimated_delivery_days || 7} dias úteis após a confirmação`
                    : 'Após a confirmação do pagamento'
                  }
                </p>
              </div>

              {/* Ações */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Home className="h-5 w-5" />
                  <span>Voltar à Loja</span>
                </Link>
                
                <Link
                  to="/products"
                  className="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Continuar Comprando</span>
                </Link>
              </div>

              {/* Avaliação */}
              {paymentVerified && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Avalie sua Experiência</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Sua opinião é muito importante para nós!
                  </p>
                  <button className="text-yellow-600 text-sm font-medium hover:text-yellow-800">
                    Deixar Avaliação →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Importantes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📧 Confirmação por Email</h4>
              <p className="text-sm text-gray-600">
                Enviamos um email de confirmação para <strong>{orderData.customer_email}</strong> 
                com todos os detalhes do seu pedido.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📱 Acompanhamento</h4>
              <p className="text-sm text-gray-600">
                Você receberá atualizações sobre o status do seu pedido por email e SMS.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚚 Entrega</h4>
              <p className="text-sm text-gray-600">
                Frete grátis para todo Brasil. Prazo de entrega: {settings?.estimated_delivery_days || 7} dias úteis.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">💬 Suporte</h4>
              <p className="text-sm text-gray-600">
                Dúvidas? Entre em contato: {settings?.contact_email || settings?.contact_phone || 'suporte@loja.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer da Página */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Obrigado por escolher {settings?.store_name}! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};