import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface QuoteRequest {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telemovel: string;
  localizacao: string;
  tipo_imovel: string;
  area: string;
  status: string;
  visualizado: boolean;
  orcamento_valor: number | null;
}

type QuotesApiResponse =
  | { success: true; data: QuoteRequest[] }
  | { success: false; error: string }
  | any;

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'em_analise' | 'enviado'>('todos');

  useEffect(() => {
    if (!user || !token) {
      navigate('/admin/login');
      return;
    }
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, navigate]);

  const fetchQuotes = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body: QuotesApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(body?.error || 'Erro ao carregar orçamentos');
      }

      // API retorna { success: true, data: [...] }
      const list = Array.isArray(body) ? body : (body?.data ?? body?.quotes ?? []);
      setQuotes(Array.isArray(list) ? list : []);
      // console.log('quotes payload:', body);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (filter === 'todos') return true;
    return quote.status === filter;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
              <p className="text-sm text-gray-600 mt-1">Bem-vindo, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos de Orçamento</h2>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'todos'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Todos ({quotes.length})
            </button>
            <button
              onClick={() => setFilter('pendente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'pendente'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Pendentes ({quotes.filter((q) => q.status === 'pendente').length})
            </button>
            <button
              onClick={() => setFilter('em_analise')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'em_analise'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Em Análise ({quotes.filter((q) => q.status === 'em_analise').length})
            </button>
            <button
              onClick={() => setFilter('enviado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'enviado'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Enviados ({quotes.filter((q) => q.status === 'enviado').length})
            </button>
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600">Nenhum orçamento encontrado</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={`hover:bg-gray-50 transition-colors ${!quote.visualizado ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{quote.nome}</div>
                        <div className="text-sm text-gray-500">{quote.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.localizacao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.tipo_imovel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            quote.status
                          )}`}
                        >
                          {getStatusText(quote.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/admin/orcamento/${quote.id}`)}
                          className="text-teal-600 hover:text-teal-900 font-medium whitespace-nowrap"
                        >
                          Ver Detalhes →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
