import { useState } from 'react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const legalContent: Record<string, { title: string; content: string }> = {
    avisos: {
      title: 'Avisos Legal',
      content: `<div class="space-y-4">
        <p><strong>IBERHIT – Premium Heating</strong></p>
        <p>Especialistas em sistemas de aquecimento radiante elétrico premium para habitações e projetos residenciais e comerciais.</p>
        
        <p><strong>Propriedade Intelectual</strong></p>
        <p>Todos os conteúdos deste website, incluindo textos, imagens, logotipos e design, são propriedade da IBERHIT e estão protegidos por direitos de autor. É proibida a reprodução sem autorização prévia.</p>
        
        <p><strong>Responsabilidade</strong></p>
        <p>As informações disponibilizadas neste website são meramente informativas. A IBERHIT não se responsabiliza por eventuais erros ou omissões, reservando-se o direito de atualizar os conteúdos sem aviso prévio.</p>
        
        <p><strong>Links Externos</strong></p>
        <p>Este website pode conter links para sites externos. A IBERHIT não se responsabiliza pelo conteúdo ou práticas de privacidade desses sites.</p>
        
        <p><strong>Contacto</strong></p>
        <p>WhatsApp: +351 915 886 550<br>Áreas de Atuação: Portugal e Espanha</p>
      </div>`
    },
    privacidade: {
      title: 'Política de Privacidade',
      content: `<div class="space-y-4">
        <p><strong>Recolha de Dados</strong></p>
        <p>A IBERHIT recolhe apenas os dados pessoais necessários para responder aos pedidos de orçamento e contacto dos clientes, nomeadamente: nome, email, telemóvel e localização.</p>
        
        <p><strong>Finalidade</strong></p>
        <p>Os dados recolhidos são utilizados exclusivamente para:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Responder a pedidos de informação e orçamentos</li>
          <li>Prestar serviços contratados</li>
          <li>Comunicações relacionadas com os nossos serviços</li>
        </ul>
        
        <p><strong>Proteção de Dados</strong></p>
        <p>A IBERHIT compromete-se a proteger os dados pessoais dos seus clientes, implementando medidas de segurança adequadas para prevenir acessos não autorizados.</p>
        
        <p><strong>Direitos dos Titulares</strong></p>
        <p>Tem o direito de aceder, retificar ou eliminar os seus dados pessoais. Para exercer estes direitos, contacte-nos através do WhatsApp: +351 915 886 550.</p>
        
        <p><strong>Partilha de Dados</strong></p>
        <p>Os seus dados não serão partilhados com terceiros sem o seu consentimento, exceto quando legalmente obrigatório.</p>
        
        <p><strong>Conservação</strong></p>
        <p>Os dados pessoais serão conservados apenas pelo período necessário para as finalidades para as quais foram recolhidos.</p>
      </div>`
    },
    cookies: {
      title: 'Política de Cookies',
      content: `<div class="space-y-4">
        <p><strong>O que são Cookies?</strong></p>
        <p>Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Permitem que o site reconheça o seu dispositivo e melhore a sua experiência de navegação.</p>
        
        <p><strong>Tipos de Cookies Utilizados</strong></p>
        <p><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do website.</p>
        <p><strong>Cookies de Desempenho:</strong> Recolhem informações sobre como os visitantes utilizam o site, permitindo melhorias.</p>
        <p><strong>Cookies de Funcionalidade:</strong> Permitem que o site se lembre das suas escolhas e preferências.</p>
        
        <p><strong>Gestão de Cookies</strong></p>
        <p>Pode gerir ou eliminar cookies através das configurações do seu navegador. Note que a desativação de cookies pode afetar a funcionalidade do website.</p>
        
        <p><strong>Cookies de Terceiros</strong></p>
        <p>Este website pode utilizar serviços de terceiros (como Google Analytics) que também utilizam cookies para análise de tráfego.</p>
        
        <p><strong>Consentimento</strong></p>
        <p>Ao continuar a navegar neste website, consente a utilização de cookies de acordo com esta política.</p>
      </div>`
    },
    condicoes: {
      title: 'Condições de Uso',
      content: `<div class="space-y-4">
        <p><strong>Aceitação dos Termos</strong></p>
        <p>Ao aceder e utilizar este website, aceita estar vinculado a estas condições de uso. Se não concordar com algum termo, não deve utilizar este website.</p>
        
        <p><strong>Utilização do Website</strong></p>
        <p>Este website destina-se a fornecer informações sobre os serviços da IBERHIT. Compromete-se a utilizar o site de forma legal e a não:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Transmitir conteúdo ilegal, ofensivo ou prejudicial</li>
          <li>Interferir com o funcionamento do website</li>
          <li>Tentar aceder a áreas restritas sem autorização</li>
          <li>Copiar ou reproduzir conteúdos sem permissão</li>
        </ul>
        
        <p><strong>Pedidos de Orçamento</strong></p>
        <p>Os pedidos de orçamento submetidos através do formulário não constituem uma proposta vinculativa. Todos os orçamentos serão analisados individualmente e enviados posteriormente.</p>
        
        <p><strong>Disponibilidade</strong></p>
        <p>A IBERHIT não garante que o website estará sempre disponível ou livre de erros. Reservamo-nos o direito de suspender ou modificar o serviço sem aviso prévio.</p>
        
        <p><strong>Modificações</strong></p>
        <p>Estas condições podem ser atualizadas periodicamente. Recomendamos que consulte esta página regularmente.</p>
        
        <p><strong>Lei Aplicável</strong></p>
        <p>Estas condições são regidas pela lei portuguesa. Qualquer litígio será da competência dos tribunais portugueses.</p>
      </div>`
    },
    qualidade: {
      title: 'Política de Qualidade',
      content: `<div class="space-y-4">
        <p><strong>Compromisso com a Excelência</strong></p>
        <p>A IBERHIT compromete-se a fornecer sistemas de aquecimento radiante elétrico da mais alta qualidade, utilizando exclusivamente tecnologia europeia com garantia vitalícia.</p>
        
        <p><strong>Padrões de Qualidade</strong></p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Produtos Premium:</strong> Apenas equipamentos certificados e testados segundo normas europeias</li>
          <li><strong>Instalação Profissional:</strong> Equipa técnica especializada e certificada</li>
          <li><strong>Materiais de Primeira:</strong> Componentes de marcas reconhecidas internacionalmente</li>
          <li><strong>Garantia Vitalícia:</strong> Cobertura total dos sistemas instalados</li>
        </ul>
        
        <p><strong>Processo de Qualidade</strong></p>
        <p><strong>1. Avaliação Técnica:</strong> Análise detalhada de cada projeto</p>
        <p><strong>2. Planeamento:</strong> Desenho personalizado do sistema</p>
        <p><strong>3. Instalação:</strong> Execução por técnicos certificados</p>
        <p><strong>4. Testes:</strong> Verificação completa do funcionamento</p>
        <p><strong>5. Acompanhamento:</strong> Suporte pós-instalação</p>
        
        <p><strong>Certificações</strong></p>
        <p>Todos os nossos sistemas cumprem as normas europeias de segurança e eficiência energética, incluindo certificações CE e ISO.</p>
        
        <p><strong>Melhoria Contínua</strong></p>
        <p>Estamos constantemente a atualizar os nossos processos e a investir em formação para garantir os mais altos padrões de qualidade.</p>
        
        <p><strong>Satisfação do Cliente</strong></p>
        <p>A sua satisfação é a nossa prioridade. Trabalhamos para superar as expectativas em cada projeto, desde habitações de luxo a empreendimentos comerciais premium.</p>
      </div>`
    },
    acessibilidade: {
      title: 'Declaração de Acessibilidade',
      content: `<div class="space-y-4">
        <p><strong>Compromisso com a Acessibilidade</strong></p>
        <p>A IBERHIT está empenhada em garantir que o seu website seja acessível a todas as pessoas, incluindo aquelas com deficiências ou limitações.</p>
        
        <p><strong>Padrões de Acessibilidade</strong></p>
        <p>Este website foi desenvolvido tendo em conta as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, procurando atingir o nível de conformidade AA.</p>
        
        <p><strong>Funcionalidades de Acessibilidade</strong></p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Navegação por teclado</li>
          <li>Textos alternativos para imagens</li>
          <li>Contraste adequado entre texto e fundo</li>
          <li>Estrutura semântica clara</li>
          <li>Formulários com etiquetas descritivas</li>
          <li>Links com descrições claras</li>
        </ul>
        
        <p><strong>Tecnologias Compatíveis</strong></p>
        <p>Este website é compatível com:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Navegadores modernos (Chrome, Firefox, Safari, Edge)</li>
          <li>Leitores de ecrã</li>
          <li>Ferramentas de ampliação</li>
          <li>Dispositivos móveis e tablets</li>
        </ul>
        
        <p><strong>Limitações Conhecidas</strong></p>
        <p>Estamos continuamente a trabalhar para melhorar a acessibilidade do nosso website. Se encontrar alguma dificuldade, por favor contacte-nos.</p>
        
        <p><strong>Feedback</strong></p>
        <p>Os seus comentários são importantes para nós. Se tiver sugestões ou encontrar barreiras de acessibilidade, contacte-nos através do WhatsApp: +351 915 886 550.</p>
        
        <p><strong>Atualização</strong></p>
        <p>Esta declaração foi atualizada pela última vez em janeiro de 2025.</p>
      </div>`
    }
  };

  const Modal = ({ isOpen, onClose, title, content }: { isOpen: boolean; onClose: () => void; title: string; content: string }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-black">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>
          <div 
            className="p-6 overflow-y-auto max-h-[calc(80vh-88px)] text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-600 rounded-lg">
                  <i className="ri-fire-line text-2xl text-white"></i>
                </div>
                <span className="text-2xl font-semibold">IBERHIT</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                A IBERHIT desenvolve e integra soluções técnicas para vivendas, apartamentos e edifícios, aliando aquecimento, iluminação, climatização e tecnologias inteligentes a uma abordagem focada na eficiência energética, conforto e sustentabilidade.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Navegação</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('nossas-solucoes')}
                    className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    Nossas Soluções
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('como-funciona')}
                    className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('tecnologia')}
                    className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    Tecnologia
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('projetos')}
                    className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    Projetos
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Contactos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-300">
                  <i className="ri-phone-line text-orange-600 mt-1"></i>
                  <div>
                    <div className="font-medium text-white">Telefone / WhatsApp</div>
                    <a href="https://wa.me/351915886550?text=Olá%2C%20vim%20através%20do%20vosso%20website%20e%20gostaria%20de%20saber%20mais%20sobre%20piso%20radiante%20elétrico." className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-2">
                      +351 915 886 550
                      <i className="ri-whatsapp-line text-green-600"></i>
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <i className="ri-mail-line text-orange-600 mt-1"></i>
                  <div>
                    <div className="font-medium text-white">Email</div>
                    <a href="mailto:info@iberhit.com" className="hover:text-orange-600 transition-colors cursor-pointer">
                      info@iberhit.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <i className="ri-map-pin-line text-orange-600 mt-1"></i>
                  <div>
                    <div className="font-medium text-white">Áreas de Atuação</div>
                    <div>Portugal e Espanha</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-3">Espanha – Showroom &amp; Oficina Técnica</h4>
                <p className="mb-1">C. Cañón de Río Lobos, 35</p>
                <p className="mb-2">37008 Salamanca – Espanha</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-3">Portugal – Escritório e Representação Legal</h4>
                <p className="mb-1">R. Cesário Verde 3</p>
                <p className="mb-2">4715-351 Fraião – Braga – Portugal</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="mb-6">
              <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-sm">
                <button
                  onClick={() => setActiveModal('avisos')}
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Avisos Legal
                </button>
                <button
                  onClick={() => setActiveModal('privacidade')}
                  data-modal="privacidade"
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Política de Privacidade
                </button>
                <button
                  onClick={() => setActiveModal('cookies')}
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Política de Cookies
                </button>
                <button
                  onClick={() => setActiveModal('condicoes')}
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Condições de Uso
                </button>
                <button
                  onClick={() => setActiveModal('qualidade')}
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Política de Qualidade
                </button>
                <button
                  onClick={() => setActiveModal('acessibilidade')}
                  className="text-gray-300 hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Declaração de Acessibilidade
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-300">
                © 2025 IBERHIT – Premium Solution Systems. Todos os direitos reservados.
              </p>
              <a 
                href="https://readdy.ai/?ref=logo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-orange-600 transition-colors cursor-pointer"
              >
                Website Builder
              </a>
            </div>
          </div>
        </div>
      </footer>

      {activeModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={legalContent[activeModal].title}
          content={legalContent[activeModal].content}
        />
      )}
    </>
  );
}
