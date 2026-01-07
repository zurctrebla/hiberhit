
export default function BenefitsSection() {
  const benefits = [
    {
      icon: 'ri-temp-hot-line',
      title: 'Conforto Térmico Uniforme',
      description: 'Distribuição homogénea do calor em todos os espaços, eliminando zonas frias e melhorando a sensação térmica durante o inverno.'
    },
    {
      icon: 'ri-layout-line',
      title: 'Design Invisível',
      description: 'Elimina radiadores visíveis e liberta espaço nas paredes, permitindo total liberdade no design de interiores.'
    },
    {
      icon: 'ri-leaf-line',
      title: 'Eficiência Energética',
      description: 'Sistema de aquecimento com elevada eficiência energética, otimizando o consumo e reduzindo custos operacionais.'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Saúde e Bem-Estar',
      description: 'Reduz a circulação de poeiras e ácaros, melhora a qualidade do ar interior e proporciona maior conforto respiratório.'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Por que <strong className="font-semibold">Piso Radiante Elétrico</strong>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Ideal para quem procura conforto térmico uniforme durante o inverno, o piso radiante elétrico distribui o calor de forma homogénea, elimina radiadores visíveis e melhora a sensação térmica em todos os espaços, com elevada eficiência energética.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-orange-100 rounded-xl mb-6">
                <i className={`${benefit.icon} text-3xl text-orange-600`}></i>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
