export default function HeroSection() {
  const scrollToForm = () => {
    const element = document.getElementById('orcamento');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {/* Desktop Image - Optimized */}
        <img
          src="https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/hero/hero-desktop.jpg"
          alt="Piso Radiante Elétrico Premium IBERHIT - Conforto Térmico Absoluto"
          className="hidden lg:block w-full h-full object-cover object-top"
          width="1920"
          height="1080"
          loading="eager"
          fetchpriority="high"
        />
        {/* Mobile Image - Optimized */}
        <img
          src="https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/hero/hero-mobile.jpg"
          alt="Piso Radiante Elétrico Premium IBERHIT - Conforto Térmico Absoluto"
          className="lg:hidden w-full h-full object-cover object-center"
          style={{ maxHeight: '70vh' }}
          width="800"
          height="1200"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/40 lg:from-black/35 lg:via-black/25 lg:to-black/35"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-6 lg:px-12 text-center text-white py-32">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight max-w-full md:max-w-none mx-auto">
          Acabe com o frio da sua casa <strong className="font-semibold">ainda este inverno</strong>
        </h1>
        
        <p className="text-lg md:text-2xl font-light mb-8 max-w-full md:max-4xl mx-auto leading-relaxed text-white/95 px-2 md:px-0">
          Projetamos e instalamos piso radiante elétrico com tecnologia europeia comprovada — conforto térmico, eficiência energética e integração total com o seu projeto.
        </p>

        <p className="text-base md:text-xl font-medium mb-12 max-w-full md:max-3xl mx-auto leading-relaxed text-orange-300 px-2 md:px-0">
          <strong>Instalação profissional incluída</strong> em projetos adjudicados até 28/02/2026
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={scrollToForm}
            className="group w-auto max-w-[85%] md:max-w-none px-6 md:px-12 lg:px-14 py-4 md:py-5 lg:py-6 bg-orange-600 text-white text-base md:text-lg lg:text-xl font-medium rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-2xl flex items-center justify-center gap-2"
          >
            <span>Solicitar Estudo Técnico Gratuito</span>
            <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="ri-arrow-down-line text-3xl text-white/80"></i>
      </div>
    </section>
  );
}