-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de utilizadores admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos de orçamento
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Dados do cliente
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telemovel VARCHAR(50),
  localizacao VARCHAR(255) NOT NULL,
  
  -- Detalhes do imóvel
  tipo_imovel VARCHAR(100) NOT NULL,
  ultimo_piso VARCHAR(50),
  exposicao_solar VARCHAR(50) NOT NULL,
  nivel_isolamento VARCHAR(100),
  zona_fria VARCHAR(100),
  sinais_humidade VARCHAR(50),
  
  -- Detalhes do projeto
  area VARCHAR(50) NOT NULL,
  tipo_pavimento VARCHAR(100) NOT NULL,
  possui_planta VARCHAR(10) NOT NULL,
  planta_url TEXT,
  planta_path TEXT,
  observacoes TEXT,
  
  -- Campos de compatibilidade
  tipo_obra VARCHAR(100) DEFAULT 'Não especificado',
  piso_localizacao VARCHAR(50),
  zona_humida VARCHAR(50),
  vidros_duplos VARCHAR(50),
  
  -- Status e gestão
  status VARCHAR(50) DEFAULT 'pendente',
  visualizado BOOLEAN DEFAULT FALSE,
  visualizado_em TIMESTAMP,
  
  -- Orçamento
  orcamento_valor DECIMAL(10,2),
  orcamento_observacoes TEXT,
  orcamento_enviado_em TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_visualizado ON quote_requests(visualizado);

-- Comentários nas tabelas
COMMENT ON TABLE admin_users IS 'Utilizadores administrativos do sistema';
COMMENT ON TABLE quote_requests IS 'Pedidos de orçamento de clientes';

-- Inserir admin padrão (ALTERAR PASSWORD EM PRODUÇÃO!)
-- Password: admin123 (hash bcrypt)
INSERT INTO admin_users (email, password_hash) 
VALUES ('admin@iberhit.com', '$2a$10$rQZ9vXqKX5YxZ5YxZ5YxZOqKX5YxZ5YxZ5YxZ5YxZ5YxZ5YxZ5Yx')
ON CONFLICT (email) DO NOTHING;