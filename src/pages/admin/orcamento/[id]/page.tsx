import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface QuoteDetail {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telemovel: string;
  localizacao: string;
  tipo_imovel: string;
  ultimo_piso: string;
  exposicao_solar: string;
  nivel_isolamento: string;
  zona_fria: string;
  sinais_humidade: string;
  area: string;
  tipo_pavimento: string;
  possui_planta: string;
  planta_url: string | null;
  observacoes: string;
  status: string;
  orcamento_valor: number | null;
  orcamento_observacoes: string | null;
}

export default function OrcamentoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [orcamentoValor, setOrcamentoValor] = useState('');
  const [orcamentoObservacoes, setOrcamentoObservacoes] = useState('');
  const [showSendForm, setShowSendForm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchQuoteDetail();
  }, [id, token, navigate]);

  const fetchQuoteDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/quotes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar orçamento');
      }

      const data = await response.json();
      setQuote(data.quote);
      
      if (data.quote.orcamento_valor) {
        setOrcamentoValor(data.quote.orcamento_valor.toString());
      }
      if (data.quote.orcamento_observacoes) {
        setOrcamentoObservacoes(data.quote.orcamento_observacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/quotes/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      await fetchQuoteDetail();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleSendQuote = async () => {
    if (!orcamentoValor) {
      alert('Por favor, insira o valor do orçamento');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/quotes/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: parseFloat(orcamentoValor),
          observacoes: orcamentoObservacoes,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar orçamento');
      }

      alert('Orçamento enviado com sucesso!');
      setShowSendForm(false);
      await fetchQuoteDetail();
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      alert('Erro ao enviar orçamento');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Orçamento não encontrado</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_analise: 'bg-blue-100 text-blue-800',
      enviado: 'bg-green-100 text-green-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pendente: 'Pendente',
      em_analise: 'Em Análise',
      enviado: 'Enviado',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Voltar ao Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pedido de Orçamento #{quote.id.slice(0, 8)}
              </h1>
              <p className="text-sm text-gray-600">
                Recebido em {new Date(quote.created_at).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(quote.status)}`}>
              {getStatusText(quote.status)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Informações do Cliente</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Nome:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.nome}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.email}</p>
                </div>
                {quote.telemovel && (
                  <div>
                    <span className="text-sm text-gray-600">Telemóvel:</span>
                    <p className="text-sm font-medium text-gray-900">{quote.telemovel}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Localização:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.localizacao}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Detalhes do Imóvel</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.tipo_imovel}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Área:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.area}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Exposição Solar:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.exposicao_solar}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tipo de Pavimento:</span>
                  <p className="text-sm font-medium text-gray-900">{quote.tipo_pavimento}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Características Adicionais</h3>
              <div className="space-y-2">
                {quote.ultimo_piso && (
                  <div>
                    <span className="text-sm text-gray-600">Último Piso:</span>
                    <p className="text-sm font-medium text-gray-900">{quote.ultimo_piso}</p>
                  </div>
                )}
                {quote.nivel_isolamento && (
                  <div>
                    <span className="text-sm text-gray-600">Nível de Isolamento:</span>
                    <p className="text-sm font-medium text-gray-900">{quote.nivel_isolamento}</p>
                  </div>
                )}
                {quote.zona_fria && (
                  <div>
                    <span className="text-sm text-gray-600">Zona Fria:</span>
                    <p className="text-sm font-medium text-gray-900">{quote.zona_fria}</p>
                  </div>
                )}
                {quote.sinais_humidade && (
                  <div>
                    <span className="text-sm text-gray-600">Sinais de Humidade:</span>
                    <p className="text-sm font-medium text-gray-900">{quote.sinais_humidade}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Documentação</h3>
              <div>
                <span className="text-sm text-gray-600">Possui Planta:</span>
                <p className="text-sm font-medium text-gray-900 mb-2">{quote.possui_planta}</p>
                {quote.planta_url && (
                  <a
                    href={`${API_URL}${quote.planta_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Descarregar Planta
                  </a>
                )}
              </div>
            </div>
          </div>

          {quote.observacoes && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Observações do Cliente</h3>
              <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">{quote.observacoes}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Ações</h3>
            <div className="flex flex-wrap gap-3">
              {quote.status === 'pendente' && (
                <button
                  onClick={() => handleUpdateStatus('em_analise')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Marcar como Em Análise
                </button>
              )}
              
              {quote.status !== 'enviado' && (
                <button
                  onClick={() => setShowSendForm(!showSendForm)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {showSendForm ? 'Cancelar Envio' : 'Enviar Orçamento ao Cliente'}
                </button>
              )}

              {quote.status === 'enviado' && quote.orcamento_valor && (
                <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    Orçamento Enviado: €{quote.orcamento_valor.toFixed(2)}
                  </p>
                  {quote.orcamento_observacoes && (
                    <p className="text-sm text-green-700">{quote.orcamento_observacoes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showSendForm && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Enviar Orçamento</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Orçamento (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={orcamentoValor}
                  onChange={(e) => setOrcamentoValor(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="1500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={orcamentoObservacoes}
                  onChange={(e) => setOrcamentoObservacoes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder="Informações adicionais sobre o orçamento..."
                />
              </div>
            </div>

            <button
              onClick={handleSendQuote}
              disabled={isSending}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSending ? 'A enviar...' : 'Confirmar e Enviar Orçamento'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
