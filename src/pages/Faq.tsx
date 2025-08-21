export function Faq() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#2563eb] tracking-tight" style={{ fontFamily: `'Playfair Display', serif` }}>Perguntas Frequentes (FAQ)</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Qual o prazo de entrega?</h2>
            <p className="text-gray-700 text-base sm:text-lg">O prazo de entrega varia de acordo com a sua localidade, mas geralmente leva de 5 a 10 dias úteis.</p>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Posso trocar um produto?</h2>
            <p className="text-gray-700 text-base sm:text-lg">Sim, você tem até 7 dias após o recebimento para solicitar a troca do seu produto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
