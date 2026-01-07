# 🚀 API Backend Iberhit

API REST para gestão de pedidos de orçamento de piso radiante elétrico.

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

1. **Instalar dependências:**
```bash
cd api
npm install
```

2. **Configurar variáveis de ambiente:**

As variáveis já estão no ficheiro `.env` na raiz do projeto.

3. **Criar tabelas no PostgreSQL:**

Execute o script SQL em `api/database/schema.sql`

4. **Criar diretório de uploads:**
```bash
mkdir uploads
```

## 🚀 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3001`

## 📡 Endpoints

### Autenticação

**POST** `/api/auth/login`
```json
{
  "email": "admin@iberhit.com",
  "password": "sua_senha"
}
```

**POST** `/api/auth/setup-admin` (apenas primeira vez)
```json
{
  "email": "admin@iberhit.com",
  "password": "sua_senha_segura"
}
```

### Orçamentos (Público)

**POST** `/api/quotes/submit`
- Content-Type: `multipart/form-data`
- Campos: nome, email, telemovel, localizacao, tipoImovel, ultimoPiso, exposicaoSolar, nivelIsolamento, zonaFria, sinaisHumidade, area, tipoPavimento, possuiPlanta, observacoes
- Ficheiro: planta (opcional)

### Admin (Requer autenticação)

**GET** `/api/admin/quotes` - Listar todos os orçamentos

**GET** `/api/admin/quotes/:id` - Obter orçamento específico

**POST** `/api/admin/quotes/:id/send` - Enviar orçamento para cliente
```json
{
  "valor": 5000.00,
  "observacoes": "Observações opcionais"
}
```

**PATCH** `/api/admin/quotes/:id/status` - Atualizar status
```json
{
  "status": "em_analise"
}
```

**DELETE** `/api/admin/quotes/:id` - Deletar orçamento

## 🔐 Autenticação

Todas as rotas `/api/admin/*` requerem token JWT no header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

## 📦 Deploy no VPS

### 1. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Clonar projeto e instalar
```bash
cd /var/www/iberhit
cd api
npm install --production
```

### 4. Criar diretório de uploads
```bash
mkdir uploads
chmod 755 uploads
```

### 5. Iniciar com PM2
```bash
pm2 start server.js --name iberhit-api
pm2 save
pm2 startup
```

### 6. Configurar Nginx como proxy reverso

Adicionar ao ficheiro de configuração do Nginx:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /uploads {
    proxy_pass http://localhost:3001/uploads;
}
```

### 7. Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

## 📊 Monitorização

```bash
# Ver logs
pm2 logs iberhit-api

# Ver status
pm2 status

# Reiniciar
pm2 restart iberhit-api

# Parar
pm2 stop iberhit-api
```

## 🔒 Segurança

- ✅ Rate limiting (100 req/15min por IP)
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ JWT para autenticação
- ✅ Passwords com bcrypt
- ✅ Validação de ficheiros
- ✅ SQL injection protection (prepared statements)

## 📝 Logs

Os logs são geridos pelo PM2 e ficam em:
```
~/.pm2/logs/
```