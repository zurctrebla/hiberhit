# 🚀 Guia de Deploy - API Backend

## 📋 Pré-requisitos

- Node.js 18+ instalado no VPS
- PostgreSQL configurado e acessível
- Nginx instalado
- PM2 para gestão de processos

## 🔧 Instalação no VPS

### 1. Preparar o ambiente

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Nginx (se ainda não estiver instalado)
sudo apt install -y nginx
```

### 2. Fazer upload do projeto

```bash
# Criar diretório do projeto
sudo mkdir -p /var/www/iberhit
sudo chown -R $USER:$USER /var/www/iberhit

# Fazer upload dos arquivos (use SCP, SFTP ou Git)
# Exemplo com SCP:
scp -r ./api user@seu-vps:/var/www/iberhit/
scp -r ./frontend user@seu-vps:/var/www/iberhit/
```

### 3. Configurar a API

```bash
cd /var/www/iberhit/api

# Instalar dependências
npm install --production

# Criar diretório de uploads
mkdir uploads
chmod 755 uploads

# Configurar variáveis de ambiente
nano .env
```

**Configurar o arquivo `.env` com suas credenciais:**

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
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=https://seu-dominio.com

# Email
RESEND_API_KEY=sua_chave_resend_aqui

# Storage
UPLOAD_DIR=./uploads
```

### 4. Configurar o PostgreSQL

```bash
# Executar script de criação das tabelas
cd /var/www/iberhit/api
psql -h 187.198.11.23 -U root -d hiberhit -f database/schema.sql
```

### 5. Criar usuário admin inicial

```bash
# Iniciar a API temporariamente
node server.js &

# Criar admin
curl -X POST http://localhost:3001/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iberhit.com",
    "password": "SuaSenhaSegura123!"
  }'

# Parar a API temporária
pkill -f "node server.js"
```

### 6. Iniciar a API com PM2

```bash
cd /var/www/iberhit/api

# Iniciar a API
pm2 start server.js --name iberhit-api

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Executar o comando que o PM2 mostrar

# Verificar status
pm2 status
pm2 logs iberhit-api
```

## 🌐 Configurar Nginx

### 1. Criar configuração do site

```bash
sudo nano /etc/nginx/sites-available/iberhit
```

**Adicionar a seguinte configuração:**

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Frontend (React)
    root /var/www/iberhit/frontend/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/iberhit-access.log;
    error_log /var/log/nginx/iberhit-error.log;

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:3001/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

### 2. Ativar o site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/iberhit /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 3. Configurar SSL com Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática já está configurada
```

## 📦 Build e Deploy do Frontend

```bash
cd /var/www/iberhit/frontend

# Instalar dependências
npm install

# Configurar variável de ambiente
echo "VITE_API_URL=https://seu-dominio.com" > .env

# Build de produção
npm run build

# Os arquivos estarão em ./dist
```

## 🔄 Atualizar a aplicação

```bash
# Atualizar código
cd /var/www/iberhit
git pull  # ou fazer upload dos novos arquivos

# Atualizar API
cd api
npm install --production
pm2 restart iberhit-api

# Atualizar Frontend
cd ../frontend
npm install
npm run build
```

## 📊 Monitoramento

```bash
# Ver logs da API
pm2 logs iberhit-api

# Ver status
pm2 status

# Monitorar recursos
pm2 monit

# Ver logs do Nginx
sudo tail -f /var/log/nginx/iberhit-access.log
sudo tail -f /var/log/nginx/iberhit-error.log
```

## 🔒 Segurança

### Firewall

```bash
# Configurar UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Backup do PostgreSQL

```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-iberhit.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/iberhit"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

PGPASSWORD=root pg_dump -h 187.198.11.23 -U root -d hiberhit > $BACKUP_DIR/iberhit_$DATE.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "iberhit_*.sql" -mtime +7 -delete
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-iberhit.sh

# Adicionar ao cron (diariamente às 2h)
sudo crontab -e
# Adicionar: 0 2 * * * /usr/local/bin/backup-iberhit.sh
```

## 🆘 Troubleshooting

### API não inicia

```bash
# Ver logs detalhados
pm2 logs iberhit-api --lines 100

# Verificar se a porta está em uso
sudo lsof -i :3001

# Reiniciar
pm2 restart iberhit-api
```

### Erro de conexão PostgreSQL

```bash
# Testar conexão
psql -h 187.198.11.23 -U root -d hiberhit

# Verificar firewall do PostgreSQL
# Verificar pg_hba.conf no servidor PostgreSQL
```

### Uploads não funcionam

```bash
# Verificar permissões
ls -la /var/www/iberhit/api/uploads
chmod 755 /var/www/iberhit/api/uploads

# Verificar espaço em disco
df -h
```

## 📞 Suporte

Para problemas ou dúvidas:
- Verificar logs: `pm2 logs iberhit-api`
- Verificar status: `pm2 status`
- Verificar Nginx: `sudo nginx -t`
