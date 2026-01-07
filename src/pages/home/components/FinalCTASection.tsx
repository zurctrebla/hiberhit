export default function FinalCTASection() {
  const scrollToForm = () => {
    const formSection = document.getElementById('orcamento');
    if (formSection) {
      const navbarHeight = 80;
      const elementPosition = formSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 relative">
          {/* Badge de Urgência */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
              <i className="ri-time-line text-lg"></i>
              <span className="text-sm font-semibold whitespace-nowrap">Válido até 28/02/2026</span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="text-center mt-4">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-3">
              Instalação Profissional Incluída — <strong className="font-semibold">Campanha de Inverno</strong>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Instalação técnica profissional integrada na solução, com acompanhamento especializado.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 mb-8 text-left">
              <p className="text-base text-gray-800 leading-relaxed mb-6">
                Durante os meses de janeiro e fevereiro, a IBERHIT inclui a instalação técnica profissional dos sistemas de piso radiante elétrico, garantindo um processo rigoroso desde a análise e dimensionamento até à execução final da obra.
              </p>

              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-base">
                    Instalação profissional e acompanhamento técnico especializado
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-base">
                    Solução dimensionada de acordo com as características do seu imóvel
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-base">
                    Proposta técnica personalizada entregue em até 48h úteis
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={scrollToForm}
              className="px-10 py-4 bg-orange-600 text-white text-lg font-medium rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-lg mb-3"
            >
              Receber Proposta Técnica
            </button>

            <p className="text-sm text-gray-600">
              Análise técnica sem compromisso.
            </p>

            {/* Aviso Legal */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                Campanha válida para projetos adjudicados até 28/02/2026, mediante confirmação técnica e disponibilidade de agenda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}