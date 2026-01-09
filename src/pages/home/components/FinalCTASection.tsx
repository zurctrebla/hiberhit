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
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 lg:p-14 relative">
          {/* Badge de Urgência */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
              <i className="ri-time-line text-lg"></i>
              <span className="text-sm font-semibold whitespace-nowrap">Oferta válida até 28/02/2026</span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="text-center mt-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-black mb-3">
              <strong className="font-semibold">Instalação Profissional Incluída</strong> — Campanha de Inverno
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Instalação técnica profissional completa integrada na solução, <strong>sem custos adicionais</strong>, com acompanhamento especializado do início ao fim.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-8 text-left">
              <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-6">
                Durante os meses de janeiro e fevereiro, a IBERHIT <strong>oferece a instalação técnica profissional completa</strong> dos sistemas de piso radiante elétrico, garantindo um processo rigoroso desde a análise e dimensionamento até à execução final da obra — <strong>totalmente incluída, sem custos extra</strong>.
              </p>

              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-sm md:text-base">
                    <strong>Instalação profissional completa incluída</strong> — sem custos adicionais de mão de obra
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-sm md:text-base">
                    Acompanhamento técnico especializado do início ao fim do projeto
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-sm md:text-base">
                    Solução dimensionada de acordo com as características do seu imóvel
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <p className="text-gray-800 text-sm md:text-base">
                    Proposta técnica personalizada entregue em até 48h úteis
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center mb-3">
              <button
                onClick={scrollToForm}
                className="w-full md:w-auto max-w-[90%] md:max-w-none px-6 md:px-10 py-4 bg-orange-600 text-white text-base md:text-lg font-medium rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-lg flex items-center justify-center"
              >
                Receber Proposta Técnica
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Análise técnica sem compromisso. Instalação profissional incluída.
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