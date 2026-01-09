export default function HowItWorksSection() {
  const scrollToQuoteForm = () => {
    const quoteSection = document.getElementById('quote-form');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="como-funciona" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Como Adaptamos o Sistema ao Seu Espaço
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Cada projeto é analisado individualmente para garantir conforto térmico real, eficiência energética e integração perfeita com o seu pavimento
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <i className="ri-file-list-3-line text-2xl md:text-3xl text-white"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Área & Uso do Espaço
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Analisamos a área total, a disposição das divisões e a forma como cada espaço é utilizado, garantindo um aquecimento equilibrado e confortável, adaptado ao dia a dia.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <i className="ri-search-eye-line text-2xl md:text-3xl text-white"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Tipo de Pavimento
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              O sistema é adaptado ao acabamento de piso escolhido — cerâmica, madeira, vinílico ou pedra — garantindo compatibilidade técnica, desempenho e durabilidade.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <i className="ri-mail-send-line text-2xl md:text-3xl text-white"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Condições Térmicas
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Avaliamos a exposição solar, as perdas térmicas e as características do edifício para definir corretamente a potência de aquecimento necessária em cada divisão.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6">
              <i className="ri-shield-check-line text-2xl md:text-3xl text-white"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Nível de Isolamento
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              O isolamento existente é tido em conta para otimizar o consumo energético, mantendo um conforto consistente.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 md:p-10 lg:p-14 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
              Projeto Técnico Rigoroso
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8">
              A nossa equipa técnica realiza um estudo detalhado do seu imóvel para dimensionar com precisão o sistema de aquecimento, garantindo conforto térmico eficaz, elevada eficiência energética e fiabilidade a longo prazo durante todo o inverno.
            </p>
            <p className="text-sm md:text-base text-white/95 mb-6 font-medium">
              É por isso que cada projeto Iberhit é verdadeiramente único.
            </p>
            <button
              onClick={scrollToQuoteForm}
              className="w-full md:w-auto max-w-[90%] md:max-w-none mx-auto flex items-center justify-center bg-white text-orange-600 px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              Receber Proposta Técnica
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
