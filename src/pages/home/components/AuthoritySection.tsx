
export default function AuthoritySection() {
  return (
    <section id="tecnologia" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/authority/equipa-tecnica.jpg"
                alt="Equipa técnica IBERHIT"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white px-8 py-6 rounded-2xl shadow-xl">
              <div className="text-4xl font-bold">50</div>
              <div className="text-sm font-medium">Anos de Inovação</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">
              <strong className="font-semibold">Tecnologia</strong> e Confiança
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Desenvolvemos soluções de aquecimento por piso radiante elétrico utilizando tecnologia <strong className="font-semibold text-black">CEILHIT</strong>, fabricante espanhol com quase 50 anos de inovação no setor.
              </p>
              
              <p>
                O dimensionamento e a instalação são realizados pela equipa técnica da <strong className="font-semibold text-black">IBERHIT</strong>, de acordo com as características reais de cada imóvel.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg flex-shrink-0">
                  <i className="ri-shield-check-line text-2xl text-orange-600"></i>
                </div>
                <div>
                  <div className="font-semibold text-black mb-1">Certificação Europeia</div>
                  <div className="text-sm text-gray-600">Normas CE e ISO</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg flex-shrink-0">
                  <i className="ri-team-line text-2xl text-orange-600"></i>
                </div>
                <div>
                  <div className="font-semibold text-black mb-1">Equipa Especializada</div>
                  <div className="text-sm text-gray-600">Instalação profissional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}