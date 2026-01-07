
export default function HowItWorksSection() {
  const factors = [
    {
      icon: 'ri-ruler-line',
      title: 'Área e Tipologia',
      description: 'Análise detalhada da área total e distribuição dos espaços a aquecer.'
    },
    {
      icon: 'ri-stack-line',
      title: 'Tipo de Pavimento',
      description: 'Adequação do sistema ao revestimento final escolhido (cerâmico, vinílico, madeira, etc.).'
    },
    {
      icon: 'ri-home-4-line',
      title: 'Condições Térmicas',
      description: 'Avaliação das características térmicas do imóvel e exposição solar.'
    },
    {
      icon: 'ri-shield-line',
      title: 'Nível de Isolamento',
      description: 'Consideração do isolamento térmico existente para otimização do consumo.'
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Soluções <strong className="font-semibold">Adaptadas ao Seu Projeto</strong>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Cada projeto é analisado individualmente. O sistema é dimensionado em função da área, do tipo de pavimento, das condições térmicas do imóvel e do nível de isolamento, garantindo conforto real e consumo otimizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {factors.map((factor, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-orange-100 rounded-2xl mb-6 mx-auto group-hover:bg-orange-600 transition-colors">
                <i className={`${factor.icon} text-4xl text-orange-600 group-hover:text-white transition-colors`}></i>
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">
                {factor.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {factor.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Box */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-10 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-600 rounded-xl flex-shrink-0">
              <i className="ri-lightbulb-line text-2xl text-white"></i>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-black mb-3">
                Dimensionamento Rigoroso
              </h4>
              <p className="text-gray-700 leading-relaxed">
                A nossa equipa técnica realiza um estudo detalhado das características do seu imóvel para garantir que o sistema de aquecimento é dimensionado de forma precisa, assegurando conforto térmico efetivo e eficiência energética ao longo de todo o inverno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
