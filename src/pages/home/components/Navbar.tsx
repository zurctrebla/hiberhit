import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
        
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3 pointer-events-auto mobile-menu-container">
          <button 
            onClick={() => scrollToSection('orcamento')}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Orçamento
          </button>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <i className="ri-close-line text-2xl"></i>
            ) : (
              <i className="ri-menu-line text-2xl"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 mobile-menu-container">
          <div className="px-6 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('nossas-solucoes')}
              className="w-full text-left px-4 py-3 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
            >
              Nossas Soluções
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="w-full text-left px-4 py-3 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('tecnologia')}
              className="w-full text-left px-4 py-3 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
            >
              Tecnologia
            </button>
            <button
              onClick={() => scrollToSection('projetos')}
              className="w-full text-left px-4 py-3 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
            >
              Projetos
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}