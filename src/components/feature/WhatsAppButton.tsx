import { useState } from 'react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    window.open(
      'https://wa.me/351915886550?text=Olá,%20gostaria%20de%20obter%20informações%20técnicas%20sobre%20piso%20radiante%20elétrico%20para%20um%20projeto.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: 'rgba(43, 43, 43, 0.28)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 43, 43, 0.35)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(43, 43, 43, 0.28)';
        }}
        aria-label="Falar com um consultor técnico no WhatsApp"
      >
        <i className="ri-whatsapp-line text-2xl text-white"></i>
        
        {/* Tooltip */}
        <div
          className={`absolute right-full mr-3 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap transition-all duration-300`}
          style={{
            backgroundColor: '#2B2B2B',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            opacity: showTooltip ? 1 : 0,
            transform: showTooltip ? 'translateX(0)' : 'translateX(8px)',
            pointerEvents: showTooltip ? 'auto' : 'none'
          }}
        >
          Falar com um consultor técnico
          <div 
            className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: '#2B2B2B' }}
          ></div>
        </div>
      </button>
    </div>
  );
}
