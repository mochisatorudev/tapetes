export function Contact() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] font-serif" style={{ fontFamily: `'Playfair Display', serif` }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#2563eb] tracking-tight" style={{ fontFamily: `'Playfair Display', serif` }}>Entre em Contato</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          Tem alguma dúvida ou sugestão? Adoraríamos ouvir você!
        </p>
        <div className="space-y-3 text-base sm:text-lg">
          <p><strong>Email:</strong> suporte@projectbolt.com</p>
          <p><strong>Telefone:</strong> (11) 98765-4321</p>
          <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 9h às 18h.</p>
        </div>
      </div>
    </div>
  );
}
