# Guia de Migração - VPS para Digital Ocean Spaces

📅 **Data:** 15 de Janeiro de 2026
🎯 **Objetivo:** Migrar arquivos existentes da VPS para Digital Ocean Spaces

---

## 📋 Pré-requisitos

✅ Digital Ocean Spaces configurado (bucket `iberhit-assets`)
✅ Credenciais no `.env` (DO_SPACES_KEY, DO_SPACES_SECRET)
✅ Scripts de migração criados (`backup-vps-files.js`, `migrate-vps-files-to-spaces.js`)
✅ Banco de dados acessível
✅ Acesso à VPS (SSH ou montagem de volume)

---

## 🚨 IMPORTANTE: Leia Antes de Começar

### Sobre a Migração

Esta migração irá:
1. ✅ Fazer upload dos arquivos para o Spaces (pasta `admin/plantas/`)
2. ✅ Atualizar o banco de dados com novos caminhos (`planta_path`)
3. ✅ Zerar `planta_url` (URLs serão geradas sob demanda)
4. ❌ **NÃO deletar** arquivos originais da VPS (backup manual)

### Antes de Executar

- ⚠️ Faça backup do banco de dados
- ⚠️ Execute em modo `--dry-run` primeiro
- ⚠️ Certifique-se de ter espaço suficiente no Spaces
- ⚠️ Verifique se as credenciais estão corretas

---

## 🛣️ Opções de Migração

Existem 3 formas de executar a migração:

### Opção 1: Executar Direto na VPS (Recomendado)

Se você tem acesso SSH à VPS:

```bash
# 1. Clone o repositório na VPS (se ainda não estiver lá)
git clone https://github.com/seu-repo/HIBERHIT2.git
cd HIBERHIT2

# 2. Instale dependências
npm install

# 3. Configure .env com credenciais do Spaces
nano .env

# 4. Execute backup primeiro
node scripts/backup-vps-files.js /mnt/volume_lon1_01/uploads/public

# 5. Execute migração em dry-run
node scripts/migrate-vps-files-to-spaces.js /mnt/volume_lon1_01/uploads/public --dry-run

# 6. Se tudo ok, execute migração real
node scripts/migrate-vps-files-to-spaces.js /mnt/volume_lon1_01/uploads/public
```

**Vantagens:**
- ✅ Acesso direto aos arquivos
- ✅ Upload mais rápido (bandwidth da VPS)
- ✅ Sem necessidade de transferir arquivos

**Desvantagens:**
- ❌ Precisa de acesso SSH

---

### Opção 2: Executar Localmente (com arquivos copiados)

Se você prefere executar no seu computador:

```bash
# 1. Copie os arquivos da VPS para local
rsync -avz user@vps-ip:/mnt/volume_lon1_01/uploads/public/ ./vps-backup/

# 2. Execute backup
node scripts/backup-vps-files.js ./vps-backup

# 3. Execute migração em dry-run
node scripts/migrate-vps-files-to-spaces.js ./vps-backup --dry-run

# 4. Se tudo ok, execute migração real
node scripts/migrate-vps-files-to-spaces.js ./vps-backup
```

**Vantagens:**
- ✅ Controle total no seu ambiente
- ✅ Backup local garantido

**Desvantagens:**
- ❌ Precisa copiar todos os arquivos primeiro
- ❌ Upload mais lento (bandwidth local)

---

### Opção 3: Executar com Volume Montado

Se você tem o volume da VPS montado localmente:

```bash
# 1. Monte o volume (exemplo com SSHFS)
sshfs user@vps-ip:/mnt/volume_lon1_01/uploads/public ./vps-mount

# 2. Execute backup
node scripts/backup-vps-files.js ./vps-mount

# 3. Execute migração em dry-run
node scripts/migrate-vps-files-to-spaces.js ./vps-mount --dry-run

# 4. Se tudo ok, execute migração real
node scripts/migrate-vps-files-to-spaces.js ./vps-mount
```

**Vantagens:**
- ✅ Sem necessidade de copiar arquivos
- ✅ Executa no seu ambiente

**Desvantagens:**
- ❌ Precisa configurar montagem de volume
- ❌ Depende de conexão estável

---

## 🔍 Passo a Passo Detalhado

### Passo 1: Backup do Banco de Dados

Antes de qualquer coisa, faça backup do banco:

```bash
# Backup completo do banco
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup-db-$(date +%Y%m%d).sql

# Ou use o script de backup (recomendado)
node scripts/backup-vps-files.js /caminho/para/uploads
```

**O que o script faz:**
- ✅ Exporta tabela `quote_requests` para JSON
- ✅ Lista todos os arquivos com metadados
- ✅ Verifica quais arquivos existem
- ✅ Calcula tamanho total
- ✅ Gera script de cópia `.sh`

**Saída esperada:**
```
======================================================================
  BACKUP DE ARQUIVOS DA VPS
======================================================================

📂 Diretório de backup: /Users/you/HIBERHIT2/scripts/backup-1768...

📊 Fazendo backup do banco de dados...
   ✓ Backup salvo: backup-1768.../db-backup-1768....json
   ✓ Total de registros: 150

📁 Criando lista de arquivos...
   ✓ Lista salva: backup-1768.../file-list-1768....json
   ✓ Total de arquivos: 150
   ✓ Arquivos existentes: 148
   ✓ Arquivos faltando: 2
   ✓ Tamanho total: 45.32 MB

📝 Criando script de cópia...
   ✓ Script salvo: backup-1768.../copy-files-1768....sh
   ✓ Execute: bash backup-1768.../copy-files-1768....sh
```

---

### Passo 2: Executar em Dry-Run

Sempre teste primeiro com `--dry-run`:

```bash
node scripts/migrate-vps-files-to-spaces.js /caminho/para/uploads --dry-run
```

**O que acontece no dry-run:**
- ✅ Verifica credenciais do Spaces
- ✅ Conecta ao banco de dados
- ✅ Lista todos os arquivos a migrar
- ✅ Simula o processo
- ❌ **NÃO faz upload**
- ❌ **NÃO altera banco de dados**

**Saída esperada:**
```
======================================================================
  MIGRAÇÃO DE ARQUIVOS DA VPS PARA DIGITAL OCEAN SPACES
======================================================================

⚠️  MODO DRY-RUN: Nenhuma alteração será feita

✓ Caminho da VPS: /caminho/para/uploads
✓ Bucket: iberhit-assets
✓ Banco: seu-banco.postgres.database.azure.com

📊 Total de registros com plantas: 150

🚀 Iniciando migração...

[1/150] Orçamento #123 - João Silva
    Arquivo atual: plantas/planta-123.pdf
    [DRY-RUN] Simulando migração...

...
```

---

### Passo 3: Executar Migração Real

Se o dry-run passou, execute a migração real:

```bash
node scripts/migrate-vps-files-to-spaces.js /caminho/para/uploads
```

**Confirmação necessária:**
```
⚠️  ATENÇÃO: Esta operação irá:
   1. Fazer upload dos arquivos para o Spaces
   2. Atualizar o banco de dados com os novos caminhos
   3. Os arquivos originais NÃO serão deletados (backup manual)

⏸️  Pressione Ctrl+C para cancelar ou Enter para continuar...
```

**Pressione Enter** para continuar.

**Processo de migração:**
```
🚀 Iniciando migração...

[1/150] Orçamento #123 - João Silva
    Arquivo atual: plantas/planta-123.pdf
    Fazendo upload: admin/plantas/migrated-123-1768....pdf (234.56 KB)
    ✓ Upload concluído: admin/plantas/migrated-123-1768....pdf
    ✓ Banco atualizado: planta_path = admin/plantas/migrated-123-1768....pdf

[2/150] Orçamento #124 - Maria Santos
    Arquivo atual: plantas/planta-124.pdf
    Fazendo upload: admin/plantas/migrated-124-1768....pdf (567.89 KB)
    ✓ Upload concluído: admin/plantas/migrated-124-1768....pdf
    ✓ Banco atualizado: planta_path = admin/plantas/migrated-124-1768....pdf

...
```

**Resumo final:**
```
======================================================================
📊 RESUMO DA MIGRAÇÃO
======================================================================

✅ Sucesso: 148
❌ Falhas: 0
⏭️  Ignorados: 2
📦 Total: 150

✅ Arquivos migrados com sucesso:
   - Orçamento #123: plantas/planta-123.pdf → admin/plantas/migrated-123-...pdf
   - Orçamento #124: plantas/planta-124.pdf → admin/plantas/migrated-124-...pdf
   ...

📄 Log salvo em: scripts/migration-log-1768....json

======================================================================
✅ Migração concluída!
======================================================================

⚠️  IMPORTANTE: Os arquivos originais NÃO foram deletados.
   Faça backup manual antes de remover da VPS.
```

---

## ✅ Pós-Migração

### Verificar Migração

1. **Verificar arquivos no Spaces:**
   ```bash
   # Listar arquivos migrados
   node -e "import('./api/services/spaces.js').then(m => m.listFiles('admin/plantas/')).then(files => console.log(files.length + ' arquivos'))"
   ```

2. **Verificar banco de dados:**
   ```sql
   -- Contar registros migrados
   SELECT COUNT(*) FROM quote_requests
   WHERE planta_path LIKE 'admin/plantas/migrated-%';

   -- Ver exemplos
   SELECT id, nome, planta_path, planta_url
   FROM quote_requests
   WHERE planta_path LIKE 'admin/plantas/migrated-%'
   LIMIT 5;
   ```

3. **Testar download no admin:**
   ```bash
   # No navegador ou via API
   GET /api/admin/quotes/123/planta
   Authorization: Bearer {seu-token-jwt}
   ```

   Resposta esperada:
   ```json
   {
     "success": true,
     "downloadUrl": "https://iberhit-assets.lon1.digitaloceanspaces.com/admin/plantas/...",
     "expiresIn": 3600,
     "storage": "spaces"
   }
   ```

---

### Atualizar Frontend Admin

Modifique componentes de visualização de plantas para usar nova rota:

```javascript
// Antes
const plantaUrl = `/uploads/${quote.planta_path}`;

// Depois
async function getPlantaUrl(quoteId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/admin/quotes/${quoteId}/planta`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.downloadUrl; // URL temporária válida por 1 hora
  }

  throw new Error('Erro ao gerar URL da planta');
}
```

---

## 🗑️ Limpar Arquivos da VPS (Opcional)

**⚠️ ATENÇÃO: Só faça isso depois de confirmar que tudo está funcionando!**

### Recomendação de Segurança

1. **Aguarde 30 dias** após migração
2. Verifique logs e relatórios
3. Confirme que não há erros
4. **Então** delete arquivos da VPS

### Como Deletar

```bash
# 1. Crie backup final antes de deletar
tar -czf vps-backup-final-$(date +%Y%m%d).tar.gz /mnt/volume_lon1_01/uploads/public/

# 2. Mova backup para local seguro
scp vps-backup-final-*.tar.gz backup-server:/safe/location/

# 3. Delete arquivos da VPS
rm -rf /mnt/volume_lon1_01/uploads/public/plantas/*

# 4. Mantenha estrutura de diretórios (caso novo upload tente salvar localmente)
mkdir -p /mnt/volume_lon1_01/uploads/public/plantas
```

---

## 🐛 Troubleshooting

### Erro: "Caminho da VPS não encontrado"

**Problema:**
```
❌ Caminho da VPS não encontrado: /mnt/volume_lon1_01/uploads/public
```

**Soluções:**

1. **Se na VPS:** Verifique se o volume está montado
   ```bash
   df -h | grep volume
   ls -la /mnt/volume_lon1_01/uploads/public
   ```

2. **Se local:** Use caminho correto para backup local
   ```bash
   node scripts/migrate-vps-files-to-spaces.js ./vps-backup
   ```

3. **Se montado:** Verifique montagem SSHFS
   ```bash
   mount | grep sshfs
   ```

---

### Erro: "Credenciais do Spaces não configuradas"

**Problema:**
```
❌ Credenciais do Spaces não configuradas!
Configure DO_SPACES_KEY e DO_SPACES_SECRET no .env
```

**Solução:**
```bash
# Verifique se .env existe
cat .env | grep DO_SPACES

# Se não existir, crie
cp .env.example .env
nano .env

# Adicione:
DO_SPACES_KEY=sua-key
DO_SPACES_SECRET=sua-secret
DO_SPACES_BUCKET=iberhit-assets
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://iberhit-assets.lon1.cdn.digitaloceanspaces.com
```

---

### Erro: "Arquivo não encontrado"

**Problema:**
```
[15/150] Orçamento #145 - Cliente X
    ⚠️  Arquivo não encontrado: /caminho/planta-145.pdf
```

**O que acontece:**
- ❌ Arquivo **não** é migrado
- ✅ Registro é marcado como "ignorado"
- ✅ Migração **continua** normalmente

**Solução:**
1. Verifique no log quais arquivos faltaram
2. Busque arquivos em outro lugar (backup antigo?)
3. Re-execute migração só para esses IDs (modifique query no script)

---

### Erro: "Access Denied" no upload

**Problema:**
```
✗ Erro no upload: Access Denied
```

**Soluções:**

1. **Verifique permissões da Spaces Key:**
   - Acesse Digital Ocean > API > Spaces Keys
   - Certifique-se que a key tem permissão de **escrita**

2. **Verifique bucket:**
   ```bash
   # No .env
   DO_SPACES_BUCKET=iberhit-assets  # Nome correto do bucket
   ```

3. **Teste credenciais:**
   ```bash
   node api/test-spaces.js
   ```

---

### Migração Interrompida

**Problema:** Script foi interrompido no meio (Ctrl+C, erro de conexão, etc.)

**Solução:**

1. **Verifique log de migração:**
   ```bash
   cat scripts/migration-log-*.json
   ```

2. **Veja quantos foram migrados:**
   ```sql
   SELECT COUNT(*) FROM quote_requests
   WHERE planta_path LIKE 'admin/plantas/migrated-%';
   ```

3. **Re-execute migração:**
   - O script detecta arquivos já migrados
   - Apenas upload de novos arquivos
   - Banco não duplica registros

---

## 🔄 Rollback (Reverter Migração)

Se algo der errado, você pode reverter:

### Opção 1: Restaurar do Backup do Banco

```bash
# Restaurar backup do banco
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup-db-20260115.sql
```

### Opção 2: Reverter Manualmente

```sql
-- Reverter planta_path para caminhos antigos
-- (use backup JSON criado pelo script de backup)

UPDATE quote_requests
SET
  planta_path = 'plantas/planta-123.pdf',  -- caminho antigo
  planta_url = 'https://vps.com/uploads/...'  -- URL antiga
WHERE id = 123;
```

### Opção 3: Script de Rollback

Crie um script baseado no log de migração:

```javascript
// scripts/rollback-migration.js
import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;
const pool = new Pool({ /* config */ });

const migrationLog = JSON.parse(fs.readFileSync('migration-log-1768....json'));

for (const item of migrationLog.success) {
  await pool.query(
    'UPDATE quote_requests SET planta_path = $1, planta_url = $2 WHERE id = $3',
    [item.oldPath, null, item.quoteId]
  );
}
```

**⚠️ IMPORTANTE:** Os arquivos já foram enviados para o Spaces e não serão deletados automaticamente.

---

## 📊 Checklist de Migração

Use este checklist para acompanhar o processo:

### Antes da Migração

- [ ] Backup completo do banco de dados
- [ ] Credenciais do Spaces configuradas no `.env`
- [ ] Script de backup executado (`backup-vps-files.js`)
- [ ] Dry-run executado com sucesso
- [ ] Espaço suficiente no Spaces (verifique limite de 250GB)
- [ ] Backup local dos arquivos (opcional, mas recomendado)

### Durante a Migração

- [ ] Migração iniciada (`migrate-vps-files-to-spaces.js`)
- [ ] Acompanhar progress no terminal
- [ ] Anotar quantos sucessos/falhas
- [ ] Salvar log de migração (`migration-log-*.json`)

### Após a Migração

- [ ] Verificar total de arquivos migrados
- [ ] Conferir registros no banco de dados
- [ ] Testar download de algumas plantas no admin
- [ ] Atualizar componentes do frontend (se necessário)
- [ ] Monitorar erros em produção por 7 dias
- [ ] Aguardar 30 dias antes de deletar arquivos da VPS

---

## 💰 Estimativa de Custos

### Exemplo: 150 arquivos de ~300 KB cada

**Storage:**
- 150 arquivos × 300 KB = 45 MB
- Custo: $5/mês (mínimo do Spaces, inclui 250 GB)

**Bandwidth:**
- 1 TB incluído no plano de $5/mês
- Downloads via URL assinada não contam para CDN
- Estimativa: $0 extra (dentro do limite)

**Total: $5/mês**

---

## 📚 Arquivos de Referência

- **Scripts:**
  - `scripts/backup-vps-files.js` - Backup antes da migração
  - `scripts/migrate-vps-files-to-spaces.js` - Migração principal

- **Documentação:**
  - `BACKEND_SPACES_GUIDE.md` - Guia de uso do backend
  - `BACKEND_IMPLEMENTATION_REPORT.md` - Relatório técnico
  - `DIGITAL_OCEAN_SETUP.md` - Setup inicial do Spaces

- **Logs gerados:**
  - `scripts/backup-*/db-backup-*.json` - Backup do banco
  - `scripts/backup-*/file-list-*.json` - Lista de arquivos
  - `scripts/backup-*/copy-files-*.sh` - Script de cópia
  - `scripts/migration-log-*.json` - Log da migração

---

## 🆘 Suporte

Se encontrar problemas:

1. **Consulte documentação:**
   - `BACKEND_SPACES_GUIDE.md`
   - Este guia (VPS_TO_SPACES_MIGRATION_GUIDE.md)

2. **Teste isoladamente:**
   ```bash
   node api/test-spaces.js
   ```

3. **Verifique logs:**
   - Terminal output
   - `migration-log-*.json`
   - Logs do servidor (se em produção)

4. **Digital Ocean:**
   - https://cloud.digitalocean.com/spaces
   - Verifique bucket, permissões, usage

---

**Boa sorte com a migração!** 🚀

Se seguir este guia passo a passo, a migração será segura e sem perda de dados.
