import { useEffect } from 'react';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';

export default function WarrantyPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            <div className="flex items-center">
              <a href="/" className="cursor-pointer">
                <img 
                  src="https://static.readdy.ai/image/281988da53201d204713e913280346d2/af90c659fe1bc547505c7f46cd3aaacf.png" 
                  alt="IBERHIT Premium Solution Systems" 
                  className="h-9 sm:h-20 md:h-24 lg:h-28 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-6">
              <i className="ri-shield-check-line text-3xl text-orange-600"></i>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4 leading-tight">
              Garantia & Certificação
            </h1>
            <p className="font-sans text-lg text-gray-600 leading-relaxed">
              Informação completa sobre a garantia vitalícia, condições de ativação e cobertura técnica em Portugal.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Garantia Vitalícia */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-gray-900 mb-6">Garantia Vitalícia do Sistema</h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-sans text-gray-700 leading-relaxed mb-4">
                Os sistemas de aquecimento radiante elétrico CEILHIT beneficiam de <strong>garantia vitalícia</strong> sobre os cabos de aquecimento, refletindo a confiança do fabricante na durabilidade e qualidade dos seus produtos.
              </p>
              <p className="font-sans text-gray-700 leading-relaxed mb-4">
                Esta garantia cobre defeitos de fabrico e falhas nos elementos de aquecimento durante toda a vida útil do sistema, desde que cumpridas as condições de instalação e registo.
              </p>
            </div>
          </div>

          {/* Condições de Ativação */}
          <div className="mb-12 bg-orange-50 rounded-2xl p-8 border border-orange-100">
            <h2 className="font-serif text-2xl text-gray-900 mb-6">Condições de Ativação da Garantia</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white flex-shrink-0 mt-1">
                  <i className="ri-check-line text-sm"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Instalação Certificada</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    O sistema deve ser instalado por técnicos qualificados, seguindo rigorosamente as especificações técnicas do fabricante e as normas europeias aplicáveis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white flex-shrink-0 mt-1">
                  <i className="ri-check-line text-sm"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Registo do Sistema</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    É obrigatório o registo da instalação junto do fabricante ou do representante técnico em Portugal (IBERHIT), no prazo de 30 dias após a conclusão da obra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white flex-shrink-0 mt-1">
                  <i className="ri-check-line text-sm"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Certificado de Instalação</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    Deve ser emitido um certificado de instalação que comprove a conformidade técnica do sistema, incluindo testes elétricos e térmicos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white flex-shrink-0 mt-1">
                  <i className="ri-check-line text-sm"></i>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Utilização Adequada</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    O sistema deve ser utilizado de acordo com as recomendações técnicas, respeitando os limites de temperatura e as condições de operação especificadas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cobertura da Garantia */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-gray-900 mb-6">Cobertura da Garantia</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50">
                    <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
                  </div>
                  <h3 className="font-sans font-semibold text-gray-900">Incluído na Garantia</h3>
                </div>
                <ul className="space-y-3 font-sans text-gray-700 text-[15px]">
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1 flex-shrink-0"></i>
                    <span>Defeitos de fabrico nos cabos de aquecimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1 flex-shrink-0"></i>
                    <span>Falhas nos elementos resistivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1 flex-shrink-0"></i>
                    <span>Problemas de isolamento elétrico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1 flex-shrink-0"></i>
                    <span>Substituição de componentes defeituosos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50">
                    <i className="ri-close-circle-line text-xl text-red-600"></i>
                  </div>
                  <h3 className="font-sans font-semibold text-gray-900">Exclusões da Garantia</h3>
                </div>
                <ul className="space-y-3 font-sans text-gray-700 text-[15px]">
                  <li className="flex items-start gap-2">
                    <i className="ri-close-line text-red-600 mt-1 flex-shrink-0"></i>
                    <span>Danos causados por instalação incorreta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-close-line text-red-600 mt-1 flex-shrink-0"></i>
                    <span>Utilização inadequada ou negligência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-close-line text-red-600 mt-1 flex-shrink-0"></i>
                    <span>Intervenções não autorizadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-close-line text-red-600 mt-1 flex-shrink-0"></i>
                    <span>Danos mecânicos externos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-close-line text-red-600 mt-1 flex-shrink-0"></i>
                    <span>Termostatos e acessórios (garantia separada)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Certificação e Normas */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-gray-900 mb-6">Certificação e Normas Europeias</h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-sans text-gray-700 leading-relaxed mb-4">
                Todos os sistemas CEILHIT são certificados CE e cumprem integralmente as normas europeias de segurança, qualidade e eficiência energética, incluindo:
              </p>
              <ul className="space-y-2 font-sans text-gray-700 mb-6">
                <li className="flex items-start gap-2">
                  <i className="ri-arrow-right-s-line text-orange-600 mt-1 flex-shrink-0"></i>
                  <span><strong>EN 60335-2-96:</strong> Segurança de aparelhos elétricos para aquecimento de pavimentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-arrow-right-s-line text-orange-600 mt-1 flex-shrink-0"></i>
                  <span><strong>IEC 60800:</strong> Cabos de aquecimento para instalações elétricas</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-arrow-right-s-line text-orange-600 mt-1 flex-shrink-0"></i>
                  <span><strong>EN 50559:</strong> Sistemas de aquecimento elétrico radiante</span>
                </li>
              </ul>
              <p className="font-sans text-gray-700 leading-relaxed">
                A certificação garante que os produtos foram submetidos a testes rigorosos de desempenho, segurança elétrica, resistência térmica e durabilidade.
              </p>
            </div>
          </div>

          {/* Apoio Técnico IBERHIT */}
          <div className="mb-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-600 text-white flex-shrink-0">
                <i className="ri-customer-service-2-line text-xl"></i>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-gray-900 mb-2">Apoio Técnico IBERHIT em Portugal</h2>
                <p className="font-sans text-gray-700 leading-relaxed">
                  A IBERHIT é o parceiro técnico oficial em Portugal, responsável pelo acompanhamento de projetos, instalação certificada e suporte pós-venda.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <i className="ri-check-double-line text-orange-600 text-xl mt-1 flex-shrink-0"></i>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Aconselhamento Técnico</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    Análise de projetos, dimensionamento de sistemas e recomendações personalizadas para cada instalação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="ri-check-double-line text-orange-600 text-xl mt-1 flex-shrink-0"></i>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Instalação Profissional</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    Equipa técnica qualificada para garantir a instalação correta e a ativação da garantia vitalícia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="ri-check-double-line text-orange-600 text-xl mt-1 flex-shrink-0"></i>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Registo e Certificação</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    Tratamento de toda a documentação necessária para ativar a garantia junto do fabricante.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="ri-check-double-line text-orange-600 text-xl mt-1 flex-shrink-0"></i>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1">Assistência Pós-Venda</h3>
                  <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                    Suporte técnico contínuo, esclarecimento de dúvidas e acompanhamento durante toda a vida útil do sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Procedimento em Caso de Reclamação */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-gray-900 mb-6">Procedimento em Caso de Reclamação</h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-sans text-gray-700 leading-relaxed mb-6">
                Caso detete alguma anomalia no funcionamento do sistema, siga os seguintes passos:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-gray-900 mb-1">Contacte a IBERHIT</h3>
                    <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                      Entre em contacto através do WhatsApp +351 915 886 550 para reportar o problema e agendar uma avaliação técnica.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-gray-900 mb-1">Avaliação Técnica</h3>
                    <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                      Um técnico qualificado irá inspecionar o sistema para identificar a causa da anomalia e verificar a elegibilidade da garantia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-gray-900 mb-1">Resolução</h3>
                    <p className="font-sans text-gray-700 text-[15px] leading-relaxed">
                      Se a reclamação for coberta pela garantia, procederemos à reparação ou substituição dos componentes defeituosos sem custos adicionais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h2 className="font-serif text-3xl mb-4">Tem Dúvidas sobre a Garantia?</h2>
            <p className="font-sans text-lg mb-6 text-orange-50">
              A nossa equipa técnica está disponível para esclarecer todas as suas questões.
            </p>
            <a
              href="https://wa.me/351915886550?text=Olá%2C%20gostaria%20de%20esclarecer%20dúvidas%20sobre%20a%20garantia%20vitalícia."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-sans font-semibold hover:bg-orange-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-whatsapp-line text-xl"></i>
              Contactar via WhatsApp
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
