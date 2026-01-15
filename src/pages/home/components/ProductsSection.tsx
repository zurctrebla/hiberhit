export default function ProductsSection() {
  const products = [
    {
      title: 'Cabo Radiante',
      description: 'Sistema de aquecimento eléctrico por cabo, totalmente integrado no pavimento, concebido para projectos à medida e geometrias complexas. A solução ideal para obras novas ou reabilitações onde é necessária máxima flexibilidade de instalação e adaptação ao espaço.',
      applications: [
        'Habitações novas e reabilitações',
        'Casas de banho e cozinhas',
        'Áreas com layouts irregulares ou zonas de difícil acesso',
        'Pavimentos cerâmicos, pedra natural e mármore'
      ],
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/products/cabo-radiante.png',
      imageAlt: 'Sistema de cabo radiante',
      imagePosition: 'left'
    },
    {
      title: 'Esteira Radiante',
      description: 'Sistema de aquecimento por esteira pré-configurada, com instalação rápida ao desenrolar a manta. Indicado para obra nova e reabilitação, sob pavimentos como cerâmica, mármore e similares, com espessura total reduzida quando combinado com isolamento térmico.',
      applications: [
        'Obra nova e reabilitação',
        'Sob pavimentos cerâmicos, mármore e similares',
        'Pode funcionar como aquecimento principal ou aquecimento auxiliar (piso morno)'
      ],
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/products/esteira-radiante.webp',
      imageAlt: 'Esteira radiante elétrica instalada sob pavimento – sistema de aquecimento por piso radiante',
      imagePosition: 'right'
    },
    {
      title: 'Manta AL Radiante',
      description: 'Sistema de aquecimento por piso radiante em alumínio, desenvolvido para pavimentos flutuantes. Uma solução de instalação seca, ultrafina e eficiente, ideal para ambientes residenciais que exigem conforto térmico com máxima proteção do pavimento.',
      applications: [
        'Casas de banho e zonas húmidas',
        'Quartos, salas e áreas residenciais',
        'Pavimentos flutuantes: vinílico, laminado e madeira natural'
      ],
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/products/manta-al-radiante.png',
      imageAlt: 'Manta radiante em alumínio instalada sob pavimento flutuante em quarto moderno',
      imagePosition: 'left'
    },
    {
      title: 'Película Radiante ECOFILM',
      description: 'Sistema ultrafino de aquecimento por película, discreto e eficiente, indicado para pavimentos flutuantes e projectos de baixo perfil.',
      applications: [
        'Salas modernas, quartos e escritórios',
        'Pavimentos vinílicos ou laminados',
        'Projectos de reabilitação com altura limitada'
      ],
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/products/pelicula-radiante-ecofilm.webp',
      imageAlt: 'Película radiante ECOFILM',
      imagePosition: 'right'
    }
  ];

  return (
    <section id="nossas-solucoes" className="bg-white scroll-mt-20">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        <div className="text-left max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4 leading-[1.2]">
            Nossas Soluções
          </h2>
          <p className="font-sans text-lg text-gray-600 leading-relaxed">
            Quatro sistemas de piso radiante eléctrico para diferentes tipos de obra, pavimento e exigência de projecto.
          </p>
        </div>
      </div>

      {/* Products - Full-width sections without gaps */}
      <div className="w-full">
        {products.map((product, index) => (
          <div 
            key={index}
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Image Column */}
              <div 
                className={`relative w-full h-[400px] lg:h-auto lg:min-h-[600px] ${
                  product.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img 
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full h-full object-cover"
                  width="960"
                  height="600"
                  loading="lazy"
                />
              </div>

              {/* Content Column */}
              <div 
                className={`flex items-center px-6 lg:px-12 xl:px-16 py-12 lg:py-16 ${
                  product.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="max-w-xl">
                  <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6 leading-[1.2]">
                    {product.title}
                  </h3>
                  
                  <p className="font-sans text-gray-600 leading-relaxed text-base mb-8">
                    {product.description}
                  </p>

                  <div className="mb-10">
                    <h4 className="font-sans font-semibold text-gray-900 text-base mb-4">Aplicações</h4>
                    <ul className="space-y-3">
                      {product.applications.map((app, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 flex-shrink-0 mt-2"></div>
                          <span className="font-sans text-gray-600 text-[15px] leading-relaxed">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a 
                    href="#orcamento"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-sans font-medium text-base rounded-xl hover:bg-orange-700 transition-all cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg"
                  >
                    Solicitar Orçamento
                    <i className="ri-arrow-right-line"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}