export default function TrustSection() {
  const scrollToForm = () => {
    const formSection = document.getElementById('orcamento');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16 border border-orange-100">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            <strong className="font-semibold">Instalação profissional incluída</strong> — oferta exclusiva de inverno
          </h2>

          <p className="text-lg md:text-xl text-orange-800 font-medium leading-relaxed mb-8">
            Campanha especial IBERHIT • Janeiro e Fevereiro 2026
          </p>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-4xl">
            Durante a campanha de inverno, a IBERHIT <strong>oferece a instalação técnica profissional completa</strong> como cortesia para sistemas de piso radiante elétrico adjudicados durante os meses de janeiro e fevereiro.
          </p>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-4xl">
            Esta oferta exclusiva garante um acompanhamento técnico rigoroso, desde a análise e dimensionamento do sistema até à execução final, assegurando conforto térmico, eficiência energética e total integração com o projeto — <strong>sem custos adicionais de instalação</strong>.
          </p>

          <button
            onClick={scrollToForm}
            className="group px-10 py-5 bg-orange-600 text-white text-lg font-medium rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-lg"
          >
            Solicitar Estudo Técnico Gratuito
            <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform inline-block"></i>
          </button>

          {/* Legal Disclaimer */}
          <p className="text-xs text-gray-500 mt-8 leading-relaxed">
            Promoção válida para pedidos adjudicados até 28/02/2026, mediante confirmação técnica e disponibilidade de agenda.
          </p>
        </div>
      </div>
    </section>
  );
}