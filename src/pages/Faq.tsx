export function Faq() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes (FAQ)</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Qual o prazo de entrega?</h2>
          <p className="text-gray-700">O prazo de entrega varia de acordo com a sua localidade, mas geralmente leva de 5 a 10 dias úteis.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Posso trocar um produto?</h2>
          <p className="text-gray-700">Sim, você tem até 7 dias após o recebimento para solicitar a troca do seu produto.</p>
        </div>
      </div>
    </div>
  );
}
