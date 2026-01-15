import { useRef, useState, useEffect } from 'react';

export default function IconicProjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = useRef(0);

  const projects = [
    {
      title: 'Hotel de Lujo K2',
      location: 'Courchevel, França',
      description: 'Hotel de luxo de 5 estrelas nas montanhas francesas. Sistema de piso radiante elétrico instalado em todas as suítes premium, áreas comuns e spa, proporcionando conforto térmico excepcional mesmo nas condições mais extremas do inverno alpino.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/hotel-k2.jpg'
    },
    {
      title: 'MNAC - Museu Nacional',
      location: 'Barcelona, Espanha',
      description: 'Museu Nacional de Arte da Catalunha. Implementação de sistema de climatização por piso radiante em galerias históricas, garantindo temperatura estável para preservação de obras de arte e conforto dos visitantes, respeitando a arquitetura centenária.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/mnac.jpg'
    },
    {
      title: 'Torre Agbar',
      location: 'Barcelona, Espanha',
      description: 'Edifício icónico de Barcelona com 38 andares. Sistema de piso radiante elétrico integrado em escritórios corporativos e áreas executivas, oferecendo eficiência energética e conforto térmico em um dos edifícios mais emblemáticos da cidade.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/torre-agbar.jpg'
    },
    {
      title: 'Basílica de San Marco',
      location: 'Veneza, Itália',
      description: 'Basílica histórica de Veneza. Instalação cuidadosa de sistema de aquecimento radiante para proteção contra humidade e preservação dos mosaicos milenares, mantendo temperatura ideal sem comprometer a integridade estrutural do monumento.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/san-marco.jpg'
    },
    {
      title: 'Hotel Park Hyatt',
      location: 'Paris, França',
      description: 'Hotel de luxo 5 estrelas no coração de Paris. Piso radiante elétrico premium instalado em todas as suítes, spa de luxo e áreas VIP, proporcionando experiência térmica incomparável aos hóspedes mais exigentes da capital francesa.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/park-hyatt.jpg'
    },
    {
      title: 'Sagrada Família',
      location: 'Barcelona, Espanha',
      description: 'Basílica projetada por Gaudí. Sistema de climatização radiante implementado em áreas específicas para conforto dos visitantes e proteção do património, respeitando o design arquitetónico único e as necessidades de conservação da obra-prima modernista.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/sagrada-familia.jpg'
    },
    {
      title: 'Edifício Intempo',
      location: 'Benidorm, Espanha',
      description: 'Arranha-céus residencial de luxo com 47 andares. Piso radiante elétrico instalado em apartamentos premium e áreas comuns, oferecendo conforto térmico e eficiência energética em uma das torres residenciais mais altas da Europa.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/edificio-intempo.jpg'
    },
    {
      title: 'Zoo Barcelona',
      location: 'Barcelona, Espanha',
      description: 'Zoológico de Barcelona. Sistema de aquecimento radiante instalado em pavilhões de animais exóticos e áreas de visitantes, garantindo temperatura controlada para bem-estar animal e conforto dos visitantes durante todo o ano.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/zoo-barcelona.jpg'
    },
    {
      title: 'Deshielo - Helipuerto Hospitales',
      location: 'Espanha',
      description: 'Heliporto hospitalar com sistema anti-gelo. Piso radiante elétrico de alta potência instalado para garantir operação segura em condições climáticas adversas, permitindo pousos e descolagens de emergência 24/7 independentemente das condições meteorológicas.',
      image: 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/projects/heliporto-hospitalar.jpg'
    }
  ];

  // Duplicar projetos para loop infinito sem espaços
  const duplicatedProjects = [...projects, ...projects, ...projects];

  // Detectar quantos cards mostrar por viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Atualizar índice atual ao fazer scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth / cardsPerView;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex % projects.length);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [cardsPerView, projects.length]);

  // Animação contínua em slow motion
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth / cardsPerView;
    const totalWidth = cardWidth * projects.length;
    const speed = 0.3; // pixels por frame (ajustar para mais lento/rápido)

    const animate = () => {
      if (!isHovered && !isInteracting && container) {
        scrollPositionRef.current += speed;
        
        // Reset suave quando chegar ao fim do primeiro conjunto
        if (scrollPositionRef.current >= totalWidth) {
          scrollPositionRef.current = 0;
        }
        
        container.scrollLeft = scrollPositionRef.current;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Iniciar posição
    if (scrollPositionRef.current === 0) {
      scrollPositionRef.current = container.scrollLeft;
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, isInteracting, cardsPerView, projects.length]);

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / cardsPerView;
      const targetScroll = cardWidth * index;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      scrollPositionRef.current = targetScroll;
    }
  };

  const handleUserInteraction = () => {
    setIsInteracting(true);
    
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  const scrollPrev = () => {
    handleUserInteraction();
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth / cardsPerView;
    const currentScroll = container.scrollLeft;
    const newScroll = Math.max(0, currentScroll - cardWidth);
    
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    scrollPositionRef.current = newScroll;
  };

  const scrollNext = () => {
    handleUserInteraction();
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth / cardsPerView;
    const currentScroll = container.scrollLeft;
    const newScroll = currentScroll + cardWidth;
    
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    scrollPositionRef.current = newScroll;
  };

  const handleDotClick = (index: number) => {
    handleUserInteraction();
    scrollToCard(index);
  };

  const handleMouseDown = () => {
    handleUserInteraction();
  };

  const handleTouchStart = () => {
    handleUserInteraction();
  };

  return (
    <section id="projetos" className="py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Projetos de <strong className="font-semibold">Referência</strong>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Referências internacionais que demonstram a fiabilidade e a versatilidade da tecnologia CEILHIT, aplicada em diferentes tipologias e contextos de projeto.
          </p>
        </div>

        {/* Carrossel */}
        <div 
          className="relative mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Botão Anterior */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-gray-700 hover:text-orange-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer"
            aria-label="Anterior"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>

          {/* Botão Seguinte */}
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-gray-700 hover:text-orange-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer"
            aria-label="Seguinte"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>

          {/* Container do Carrossel */}
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'auto'
              }}
            >
              {duplicatedProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 snap-start px-3 first:pl-6 last:pr-6"
                  style={{
                    width: `${100 / cardsPerView}%`
                  }}
                >
                  <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{project.title}</h3>
                      <p className="text-orange-400 text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <i className="ri-map-pin-line"></i>
                        {project.location}
                      </p>
                      <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots de Paginação */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: projects.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'w-8 bg-orange-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Categorias e Outros Projetos */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-light text-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                Categorias de <span className="font-normal">Projetos</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['Vivendas', 'Hotéis', 'Igrejas', 'Instalações Desportivas', 'Museus', 'Escritórios', 'Hospitais', 'Zoológicos'].map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <i className="ri-checkbox-circle-line text-orange-600 text-xl"></i>
                    <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                Outros Projetos e <span className="font-normal">Colaborações</span>
              </h3>
              <div className="space-y-3">
                {['Mercadona', 'Zoo Fuengirola', 'Bioparc', 'Meliá Hotels', 'NH Hotels', 'Decathlon', 'Carrefour', 'El Corte Inglés'].map((company, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-orange-600 bg-gray-50">
                    <i className="ri-building-line text-orange-600"></i>
                    <span className="text-gray-700 font-medium" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{company}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}