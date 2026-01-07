# 📋 Guia de Migração - Supabase para PostgreSQL Próprio

## ✅ O que foi migrado

### 1. **Autenticação**
- ❌ Supabase Auth
- ✅ JWT próprio com bcrypt

### 2. **Base de Dados**
- ❌ Supabase PostgreSQL
- ✅ PostgreSQL próprio (187.198.11.23)

### 3. **Storage**
- ❌ Supabase Storage
- ✅ Storage local (uploads/)

### 4. **Edge Functions**
- ❌ Supabase Edge Functions
- ✅ API REST Express.js

### 5. **Email**
- ✅ Resend (mantido)

## 🗂️ Estrutura do Projeto

```
iberhit/
├── api/                          # Backend Node.js
│   ├── config/
│   │   └── database.js          # Conexão PostgreSQL
│   ├── database/
│   │   └── schema.sql           # Schema das tabelas
│   ├── middleware/
│   │   └── auth.js              # Autenticação JWT
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── quotes.js            # Rotas de orçamentos
│   │   └── admin.js             # Rotas admin
│   ├── services/
│   │   └── email.js             # Serviço de email
│   ├── uploads/                 # Ficheiros enviados
│   ├── server.js                # Servidor Express
│   ├── package.json
│   └── .env
│
└── frontend/                     # Frontend React
    ├── src/
    │   ├── contexts/
    │   │   └── AuthContext.tsx  # Contexto de autenticação
    │   ├── pages/
    │   │   ├── home/
    │   │   │   └── components/
    │   │   │       └── QuoteFormSection.tsx
    │   │   └── admin/
    │   │       ├── login/
    │   │       ├── dashboard/
    │   │       └── orcamento/
    │   └── ...
    └── .env
```

## 🔄 Mudanças Principais

### Frontend

#### Antes (Supabase):
```typescript
import { supabase } from './lib/supabase';

// Autenticação
await supabase.auth.signInWithPassword({ email, password });

// Inserir dados
await supabase.from('quote_requests').insert(data);

// Buscar dados
const { data } = await supabase.from('quote_requests').select('*');
```

#### Depois (API REST):
```typescript
const API_URL = import.meta.env.VITE_API_URL;

// Autenticação
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Inserir dados
await fetch(`${API_URL}/api/quotes/submit`, {
  method: 'POST',
  body: formData
});

// Buscar dados
const response = await fetch(`${API_URL}/api/admin/quotes`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🔐 Autenticação

### Sistema JWT

1. **Login**: Retorna token JWT
2. **Token**: Armazenado no localStorage
3. **Requisições**: Token enviado no header `Authorization: Bearer <token>`
4. **Expiração**: 7 dias (configurável)

### Criar Admin

```bash
curl -X POST http://localhost:3001/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iberhit.com",
    "password": "SuaSenhaSegura123!"
  }'
```

## 📡 API Endpoints

### Públicos

- `POST /api/quotes/submit` - Enviar pedido de orçamento
- `GET /health` - Health check

### Autenticação

- `POST /api/auth/login` - Login admin
- `POST /api/auth/setup-admin` - Criar primeiro admin (apenas se não existir)

### Admin (requer token)

- `GET /api/admin/quotes` - Listar todos os orçamentos
- `GET /api/admin/quotes/:id` - Ver orçamento específico
- `PATCH /api/admin/quotes/:id/status` - Atualizar status
- `POST /api/admin/quotes/:id/send` - Enviar orçamento ao cliente

## 📦 Variáveis de Ambiente

### Backend (.env na pasta api/)

```env
# PostgreSQL
DB_HOST=187.198.11.23
DB_PORT=5432
DB_NAME=hiberhit
DB_USER=root
DB_PASSWORD=root
DB_SSL=true

# API
API_PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://seu-dominio.com

# Email
RESEND_API_KEY=sua_chave_resend

# Storage
UPLOAD_DIR=./uploads
```

### Frontend (.env na raiz)

```env
VITE_API_URL=https://seu-dominio.com
```

## 🗄️ Schema do PostgreSQL

```sql
-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quote requests
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telemovel VARCHAR(50),
  localizacao VARCHAR(255) NOT NULL,
  tipo_imovel VARCHAR(100) NOT NULL,
  ultimo_piso VARCHAR(50),
  exposicao_solar VARCHAR(50) NOT NULL,
  nivel_isolamento VARCHAR(100),
  zona_fria VARCHAR(100),
  sinais_humidade VARCHAR(50),
  area VARCHAR(50) NOT NULL,
  tipo_pavimento VARCHAR(100) NOT NULL,
  possui_planta VARCHAR(10) NOT NULL,
  planta_url TEXT,
  planta_path TEXT,
  observacoes TEXT,
  status VARCHAR(50) DEFAULT 'pendente',
  visualizado BOOLEAN DEFAULT FALSE,
  visualizado_em TIMESTAMP,
  orcamento_valor DECIMAL(10,2),
  orcamento_observacoes TEXT,
  orcamento_enviado_em TIMESTAMP
);
```

## 🚀 Deploy

### Desenvolvimento Local

```bash
# Backend
cd api
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

### Produção (VPS)

Ver arquivo `api/README_DEPLOY.md` para instruções completas.

## 📊 Comparação

| Recurso | Supabase | PostgreSQL Próprio |
|---------|----------|-------------------|
| Custo | Pago após limite | Apenas VPS |
| Controle | Limitado | Total |
| Escalabilidade | Automática | Manual |
| Backup | Automático | Manual |
| Latência | Variável | Controlável |
| Customização | Limitada | Total |

## ⚠️ Pontos de Atenção

1. **Backup**: Configure backups automáticos do PostgreSQL
2. **SSL**: Use HTTPS em produção (Let's Encrypt)
3. **Segurança**: Mude o JWT_SECRET em produção
4. **Monitoramento**: Use PM2 para logs e restart automático
5. **Storage**: Configure storage externo (S3, Azure) para produção
6. **Email**: Configure Resend API Key válida

## 🔄 Próximos Passos

1. ✅ Testar localmente
2. ✅ Configurar PostgreSQL
3. ✅ Criar admin inicial
4. ✅ Deploy no VPS
5. ✅ Configurar Nginx
6. ✅ Configurar SSL
7. ✅ Configurar backups
8. ✅ Testar em produção

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar logs: `pm2 logs iberhit-api`
- Verificar conexão DB: `psql -h 187.198.11.23 -U root -d hiberhit`
- Verificar API: `curl http://localhost:3001/health`
