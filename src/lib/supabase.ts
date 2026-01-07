import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são obrigatórios');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QuoteRequest {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telemovel?: string;
  telefone?: string;
  localizacao: string;
  tipo_obra?: string;
  tipo_projeto?: string;
  tipo_imovel: string;
  piso_localizacao?: string;
  ultimo_piso?: string;
  zona_humida?: string;
  exposicao_solar: string;
  vidros_duplos?: string;
  nivel_isolamento?: string;
  zona_fria?: string;
  sinais_humidade?: string;
  area: string;
  tipo_pavimento: string;
  possui_planta: string;
  planta_url?: string;
  planta_path?: string;
  observacoes?: string;
  status?: string;
  visualizado?: boolean;
  visualizado_em?: string;
  orcamento_valor?: number;
  orcamento_observacoes?: string;
  orcamento_enviado_em?: string;
}
