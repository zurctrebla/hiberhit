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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="orcamento" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Peça o Seu Orçamento Gratuito
          </h2>
          <p className="text-lg text-gray-600">
            Preencha o formulário e receba uma proposta personalizada em 24 horas
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Último Piso?
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exposição Solar *
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Isolamento
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona Fria?
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sinais de Humidade?
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'A enviar...' : 'Enviar Pedido de Orçamento'}
          </button>
        </form>
      </div>
    </section>
  );
}