import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function QuoteFormSection() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telemovel: '',
    localizacao: '',
    tipo_imovel: '',
    ultimo_piso: '',
    exposicao_solar: '',
    nivel_isolamento: '',
    zona_fria: '',
    sinais_humidade: '',
    area: '',
    tipo_pavimento: '',
    possui_planta: '',
    observacoes: ''
  });
  const [plantaFile, setPlantaFile] = useState<File | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlantaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // GDPR validation: block submission if consent not given
    if (!privacyConsent) {
      setShowConsentError(true);
      // Scroll to consent checkbox
      const consentElement = document.getElementById('privacy-consent');
      if (consentElement) {
        consentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setShowConsentError(false);
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (plantaFile) {
        formDataToSend.append('planta', plantaFile);
      }

      const response = await fetch(`${API_URL}/api/quotes/submit`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar orçamento');
      }

      setSubmitStatus('success');
      setFormData({
        nome: '',
        email: '',
        telemovel: '',
        localizacao: '',
        tipo_imovel: '',
        ultimo_piso: '',
        exposicao_solar: '',
        nivel_isolamento: '',
        zona_fria: '',
        sinais_humidade: '',
        area: '',
        tipo_pavimento: '',
        possui_planta: '',
        observacoes: ''
      });
      setPlantaFile(null);
      setPrivacyConsent(false);
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPrivacyPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger the Privacy Policy modal in Footer
    const privacyButton = document.querySelector('[data-modal="privacidade"]') as HTMLButtonElement;
    if (privacyButton) {
      privacyButton.click();
    }
  };

  const Tooltip = ({ id, text }: { id: string; text: string }) => (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
        onClick={() => setActiveTooltip(activeTooltip === id ? null : id)}
        className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
      >
        <i className="ri-information-line text-xs text-gray-600"></i>
      </button>
      {activeTooltip === id && (
        <div className="absolute z-10 w-72 p-3 bg-gray-900 text-white text-xs leading-relaxed rounded-lg shadow-xl -top-2 left-8">
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
          {text}
        </div>
      )}
    </div>
  );

  return (
    <section id="orcamento" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Peça o Seu Orçamento Gratuito
          </h2>
          <p className="text-lg text-gray-600 mb-3">
            Preencha o formulário e receba uma proposta personalizada em 24 horas
          </p>
          <p className="text-base text-orange-700 font-medium">
            <strong>Instalação profissional incluída</strong> em projetos adjudicados até 28/02/2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-lg">
          {/* ... existing code ... */}
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="joao@exemplo.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telemóvel
              </label>
              <input
                type="tel"
                name="telemovel"
                value={formData.telemovel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="+351 912 345 678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                placeholder="Lisboa, Porto, etc."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Imóvel *
              </label>
              <select
                name="tipo_imovel"
                value={formData.tipo_imovel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="apartamento">Apartamento</option>
                <option value="moradia">Moradia</option>
                <option value="comercial">Comercial</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Último Piso?
                <Tooltip 
                  id="ultimo-piso"
                  text="Os imóveis situados no último piso estão mais expostos a perdas térmicas, sobretudo quando não existe isolamento adequado na cobertura. Esta informação é essencial para dimensionar corretamente o sistema de aquecimento."
                />
              </label>
              <select
                name="ultimo_piso"
                value={formData.ultimo_piso}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Exposição Solar *
                <Tooltip 
                  id="exposicao-solar"
                  text="A orientação solar influencia significativamente os ganhos térmicos naturais do espaço. Ambientes com menor exposição solar tendem a necessitar de maior potência de aquecimento."
                />
              </label>
              <select
                name="exposicao_solar"
                value={formData.exposicao_solar}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="norte">Norte</option>
                <option value="sul">Sul</option>
                <option value="este">Este</option>
                <option value="oeste">Oeste</option>
                <option value="multipla">Múltipla</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Nível de Isolamento
                <Tooltip 
                  id="nivel-isolamento"
                  text="O nível de isolamento do imóvel (paredes, janelas e caixilharias) é um dos fatores mais importantes no desempenho térmico. Um bom isolamento reduz o consumo energético e melhora o conforto."
                />
              </label>
              <select
                name="nivel_isolamento"
                value={formData.nivel_isolamento}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="bom">Bom</option>
                <option value="medio">Médio</option>
                <option value="fraco">Fraco</option>
                <option value="nao_sei">Não sei</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Zona Fria?
                <Tooltip 
                  id="zona-fria"
                  text="Alguns espaços da habitação podem apresentar temperaturas mais baixas devido à sua localização, orientação ou contacto com zonas não aquecidas. Identificar estas áreas permite uma solução mais eficiente."
                />
              </label>
              <select
                name="zona_fria"
                value={formData.zona_fria}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="nao_sei">Não sei</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Sinais de Humidade?
                <Tooltip 
                  id="sinais-humidade"
                  text="A presença de humidade pode afetar o conforto térmico e a sensação de frio. Esta informação ajuda-nos a avaliar corretamente o comportamento térmico do espaço."
                />
              </label>
              <select
                name="sinais_humidade"
                value={formData.sinais_humidade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Aproximada *
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="ate_50">Até 50m²</option>
                <option value="50_100">50-100m²</option>
                <option value="100_150">100-150m²</option>
                <option value="150_200">150-200m²</option>
                <option value="mais_200">Mais de 200m²</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pavimento *
              </label>
              <select
                name="tipo_pavimento"
                value={formData.tipo_pavimento}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Selecione...</option>
                <option value="ceramica">Cerâmica</option>
                <option value="madeira">Madeira</option>
                <option value="vinilico">Vinílico</option>
                <option value="pedra">Pedra</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Possui Planta do Imóvel? *
            </label>
            <select
              name="possui_planta"
              value={formData.possui_planta}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            >
              <option value="">Selecione...</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {formData.possui_planta === 'sim' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload da Planta (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Adicionais
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              placeholder="Informações adicionais que considere relevantes..."
            />
          </div>

          {/* GDPR: Data Purpose Statement */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              <i className="ri-information-line text-blue-600 mr-2"></i>
              Os seus dados pessoais serão utilizados exclusivamente para processar o seu pedido de orçamento e entrar em contacto consigo, conforme descrito na nossa Política de Privacidade.
            </p>
          </div>

          {/* GDPR: Required Privacy Consent Checkbox */}
          <div id="privacy-consent" className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => {
                  setPrivacyConsent(e.target.checked);
                  if (e.target.checked) {
                    setShowConsentError(false);
                  }
                }}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Li e aceito a{' '}
                <button
                  type="button"
                  onClick={openPrivacyPolicy}
                  className="text-teal-600 hover:text-teal-700 underline font-medium cursor-pointer"
                >
                  Política de Privacidade
                </button>
                {' '}*
              </span>
            </label>
            
            {/* Validation Error Message */}
            {showConsentError && (
              <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
                <i className="ri-error-warning-line mt-0.5"></i>
                <span>Deve aceitar a Política de Privacidade para enviar o pedido de orçamento.</span>
              </div>
            )}
          </div>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Orçamento enviado com sucesso! Entraremos em contacto em breve.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ❌ Erro ao enviar orçamento. Por favor, tente novamente.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto max-w-[90%] md:max-w-none px-6 md:px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg flex items-center justify-center"
            >
              {isSubmitting ? 'A enviar...' : 'Enviar Pedido de Orçamento'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}