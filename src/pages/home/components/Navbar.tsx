import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 pointer-events-auto ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center pointer-events-auto" style={{ marginTop: '6px' }}>
          <a href="/" className="flex items-center cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/281988da53201d204713e913280346d2/af90c659fe1bc547505c7f46cd3aaacf.png"
              alt="IBERHIT"
              className="h-16 md:h-18 lg:h-20 w-auto object-contain"
            />
          </a>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 pointer-events-auto">
          <button 
            onClick={() => scrollToSection('nossas-solucoes')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isScrolled ? 'text-black hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
          >
            Nossas Soluções
          </button>
          <button 
            onClick={() => scrollToSection('como-funciona')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isScrolled ? 'text-black hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('tecnologia')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isScrolled ? 'text-black hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
          >
            Tecnologia
          </button>
          <button 
            onClick={() => scrollToSection('projetos')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isScrolled ? 'text-black hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
          >
            Projetos
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => scrollToSection('orcamento')}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Orçamento
          </button>
        </div>
      </div>
    </nav>
  );
}