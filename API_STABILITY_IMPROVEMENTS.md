# Melhorias de Estabilidade da API

📅 **Data:** 15 de Janeiro de 2026
✅ **Status:** Implementado

---

## 🎯 Objetivo

Prevenir reiniciações excessivas da API e melhorar monitoramento.

---

## 📊 Problema Original

### Sintomas
- **151 restarts** da API em curto período
- Login no admin não funcionava
- API crashando em loop

### Causas Identificadas

1. **Import errado** em `api/routes/uploads.js`
   ```javascript
   // ❌ Errado
   import { verifyToken } from '../middleware/auth.js';

   // ✅ Correto
   import { authenticateToken } from '../middleware/auth.js';
   ```

2. **Dependência faltando**
   ```bash
   # Faltava:
   @aws-sdk/s3-request-presigner
   ```

3. **PM2 reiniciando automaticamente**
   - Sem limites de restart
   - Sem delay entre tentativas
   - Loop infinito de crashes

---

## ✅ Soluções Implementadas

### 1. Configuração PM2 com Limites

**Arquivo:** `api/ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [{
    name: 'api',
    script: './server.js',

    // Limites de restart
    max_restarts: 10,              // Máximo de 10 restarts em 1 minuto
    min_uptime: '10s',             // Considera crash se cair antes de 10s
    restart_delay: 4000,           // Aguarda 4s antes de reiniciar
    exp_backoff_restart_delay: 100, // Aumenta delay exponencialmente

    // Limites de recursos
    max_memory_restart: '500M',    // Restart se usar mais de 500MB

    // Timeouts
    listen_timeout: 3000,
    kill_timeout: 5000,
  }]
};
```

**Como usar:**

```bash
# Iniciar com configuração
cd /root/hiberhit/api
pm2 start ecosystem.config.cjs

# Ou reiniciar processo existente
pm2 restart api
```

---

### 2. Graceful Shutdown

**Arquivo:** `api/server.js`

**O que foi adicionado:**

```javascript
// Captura sinais de encerramento
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Encerra conexões antes de parar
const gracefulShutdown = (signal) => {
  console.log(`Recebido ${signal}. Encerrando gracefully...`);

  server.close(() => {
    console.log('Servidor HTTP encerrado');
    process.exit(0);
  });

  // Force shutdown após 10 segundos
  setTimeout(() => {
    console.error('Forçando encerramento após timeout');
    process.exit(1);
  }, 10000);
};
```

**Benefícios:**
- Encerra conexões ativas antes de parar
- Previne perda de requisições em andamento
- Timeout de segurança (10s)

---

### 3. Tratamento de Erros Não Capturados

**Arquivo:** `api/server.js`

```javascript
// Captura promessas rejeitadas não tratadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  // Apenas loga, não encerra processo
});

// Captura exceções não tratadas
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Encerra processo (exceção grave)
  process.exit(1);
});
```

**Benefícios:**
- Loga erros que seriam silenciosos
- Previne crashes inesperados
- Facilita debugging

---

### 4. Script de Monitoramento

**Arquivo:** `scripts/monitor-api.sh`

**Como usar:**

```bash
# Executar monitoramento
bash scripts/monitor-api.sh
```

**O que verifica:**

1. ✅ Status PM2 (online/offline)
2. ✅ Número de restarts
3. ✅ Health check (API respondendo?)
4. ✅ Uso de memória
5. ✅ Últimos erros
6. ✅ Uptime

**Saída esperada:**

```
========================================
  MONITORAMENTO DA API - IBERHIT
========================================

📊 Status PM2:
│ api    │ online    │ 0        │

Restarts: 0
✅ Restarts normais

========================================
🔍 Health Check:
✅ API respondendo
{"status":"ok","timestamp":"2026-01-15T..."}

========================================
💾 Uso de Memória:
memory: 58.9 MB

========================================
📝 Últimos Erros:
(nenhum)

========================================
⏱️  Uptime:
uptime: 2h
```

---

## 📋 Como Usar

### Deploy com Nova Configuração

```bash
# 1. Na VPS, fazer pull das mudanças
cd /root/hiberhit
git pull origin main

# 2. Parar API atual
pm2 stop api
pm2 delete api

# 3. Iniciar com nova configuração
cd api
pm2 start ecosystem.config.cjs

# 4. Salvar configuração PM2
pm2 save

# 5. Configurar PM2 para iniciar no boot
pm2 startup
# (execute o comando que ele mostrar)
```

### Monitoramento Contínuo

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs api

# Executar script de monitoramento
bash scripts/monitor-api.sh

# Monitoramento automático (cron - opcional)
# Adicione ao crontab:
# */5 * * * * bash /root/hiberhit/scripts/monitor-api.sh >> /root/hiberhit/logs/monitor.log 2>&1
```

---

## 🚨 Alertas

### Alerta 1: Restarts > 5

**Sintoma:**
```
⚠️  ALERTA: Mais de 5 restarts detectados!
```

**Ação:**
1. Ver logs: `pm2 logs api --lines 50`
2. Identificar causa do crash
3. Corrigir código
4. Fazer deploy
5. Resetar contador: `pm2 restart api`

### Alerta 2: API Não Responde

**Sintoma:**
```
❌ API não está respondendo!
```

**Ação:**
1. Verificar se está rodando: `pm2 status`
2. Ver logs: `pm2 logs api`
3. Reiniciar se necessário: `pm2 restart api`
4. Se persistir, verificar porta: `netstat -tlnp | grep 3001`

### Alerta 3: Memória Alta

**Sintoma:**
```
memory: 450 MB (próximo do limite de 500MB)
```

**Ação:**
1. Investigar memory leak
2. Aumentar limite temporariamente no `ecosystem.config.cjs`
3. Otimizar código que consome muita memória

---

## 📊 Comparação: Antes vs Depois

### Antes (Sem Proteções)

```
❌ Restarts: 151
❌ Crash loop sem controle
❌ Sem graceful shutdown
❌ Erros não capturados
❌ Sem monitoramento
```

### Depois (Com Proteções)

```
✅ Restarts: 0
✅ Limite de 10 restarts por minuto
✅ Delay exponencial entre tentativas
✅ Graceful shutdown implementado
✅ Erros capturados e logados
✅ Script de monitoramento disponível
```

---

## 🔧 Troubleshooting

### PM2 não encontra ecosystem.config.cjs

```bash
# Certifique-se de estar na pasta api/
cd /root/hiberhit/api
ls ecosystem.config.cjs  # Deve existir

# Use caminho absoluto
pm2 start /root/hiberhit/api/ecosystem.config.cjs
```

### API ainda reiniciando muito

```bash
# 1. Ver causa nos logs
pm2 logs api --lines 100 | grep "Error"

# 2. Verificar dependências
cd /root/hiberhit/api
npm list | grep "UNMET"

# 3. Reinstalar se necessário
rm -rf node_modules
npm install

# 4. Reiniciar
pm2 restart api
```

### Script de monitoramento não executa

```bash
# Dar permissão de execução
chmod +x /root/hiberhit/scripts/monitor-api.sh

# Executar
bash /root/hiberhit/scripts/monitor-api.sh
```

---

## 📈 Métricas Pós-Implementação

### Objetivos

- ✅ **Restarts:** Manter em 0
- ✅ **Uptime:** > 99.9%
- ✅ **Memória:** < 200 MB (normal)
- ✅ **Response time:** < 100ms (health check)

### Monitorar Semanalmente

```bash
# Ver estatísticas da última semana
pm2 describe api

# Ver total de restarts desde início
pm2 jlist | grep restart_time
```

---

## 🎯 Próximos Passos (Opcional)

### 1. Alertas Automáticos via Email

Configurar PM2 para enviar email em caso de crash:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

### 2. Monitoramento Visual

Usar PM2 Plus (pago) ou Grafana (gratuito) para dashboards.

### 3. Log Rotation

Prevenir que logs cresçam infinitamente:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:retain 7
```

---

## 📚 Referências

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Node.js Process Events](https://nodejs.org/api/process.html#process_event_sigterm)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)

---

**Implementado com sucesso!** 🚀

A API agora está protegida contra crashes em loop e tem monitoramento adequado.
