# Digital Ocean Spaces - Guia de Configuração

Este guia explica como configurar o Digital Ocean Spaces para armazenamento de arquivos públicos (imagens) e privados (documentos administrativos).

## 📋 Pré-requisitos

- Conta na Digital Ocean
- Projeto HIBERHIT configurado

## 🔑 Passo 1: Criar Spaces Keys (Credenciais)

1. Acesse o painel da Digital Ocean: https://cloud.digitalocean.com/
2. No menu lateral, clique em **"API"**
3. Role até a seção **"Spaces Keys"**
4. Clique em **"Generate New Key"**
5. Dê um nome para a key (ex: `iberhit-spaces-key`)
6. Copie:
   - **Access Key** (DO_SPACES_KEY)
   - **Secret Key** (DO_SPACES_SECRET) - só aparece uma vez!

⚠️ **IMPORTANTE**: Guarde o Secret Key imediatamente, ele não será mostrado novamente!

## 🔧 Passo 2: Configurar as Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env`:

```bash
# Digital Ocean Spaces Configuration
DO_SPACES_KEY=sua-access-key-aqui
DO_SPACES_SECRET=sua-secret-key-aqui
DO_SPACES_BUCKET=iberhit-assets
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://iberhit-assets.lon1.cdn.digitaloceanspaces.com
```

## 📦 Passo 3: Fazer Upload das Imagens

Execute o script de upload:

```bash
node scripts/upload-images-to-spaces.js
```

Este script irá:
- ✅ Criar o bucket `iberhit-assets` se não existir
- ✅ Configurar CORS para permitir acesso público
- ✅ Fazer upload de todas as imagens da pasta `public/images/`
- ✅ Gerar um arquivo `cdn-urls.json` com as URLs do CDN

## 🌐 Passo 4: Ativar o CDN (Opcional mas Recomendado)

1. No painel da Digital Ocean, acesse **"Spaces"**
2. Clique no Space `iberhit-assets`
3. Vá na aba **"Settings"**
4. Na seção **"CDN"**, clique em **"Enable CDN"**
5. Aguarde alguns minutos para o CDN ser provisionado

**Benefícios do CDN:**
- ⚡ Carregamento mais rápido das imagens
- 🌍 Distribuição global de conteúdo
- 💰 Menor custo de bandwidth

## 🔄 Passo 5: Atualizar os Componentes

Após o upload, atualize os componentes React com as URLs do CDN:

```bash
node scripts/update-components-urls.js
```

## 📁 Estrutura de Arquivos no Spaces

```
iberhit-assets/
├── images/                    # Arquivos PÚBLICOS (acesso via CDN)
│   ├── hero/
│   │   ├── hero-desktop.jpg
│   │   └── hero-mobile.jpg
│   ├── products/
│   │   ├── cabo-radiante.png
│   │   ├── esteira-radiante.webp
│   │   ├── manta-al-radiante.png
│   │   └── pelicula-radiante-ecofilm.webp
│   ├── authority/
│   │   └── equipa-tecnica.jpg
│   └── projects/
│       ├── hotel-k2.jpg
│       ├── mnac.jpg
│       └── ...
└── admin/                     # Arquivos PRIVADOS (acesso via API)
    ├── documents/
    │   └── orcamento-123.pdf
    └── attachments/
        └── ...
```

## 🔒 Uso na API - Arquivos Privados

### Upload de Arquivo Privado

```javascript
import { uploadPrivateFile } from '../services/spaces.js';

// Exemplo: upload de documento de orçamento
const key = await uploadPrivateFile(
  '/path/to/file.pdf',
  'admin/documents/orcamento-123.pdf',
  'application/pdf'
);
// Retorna: 'admin/documents/orcamento-123.pdf'
```

### Gerar URL Temporária para Download

```javascript
import { getPrivateFileUrl } from '../services/spaces.js';

// Gera URL válida por 1 hora (3600 segundos)
const downloadUrl = await getPrivateFileUrl('admin/documents/orcamento-123.pdf', 3600);
// Retorna: https://iberhit-assets.lon1.digitaloceanspaces.com/admin/documents/orcamento-123.pdf?X-Amz-Algorithm=...
```

### Upload Direto de Buffer

```javascript
import { uploadBuffer } from '../services/spaces.js';

// Upload de imagem pública
const url = await uploadBuffer(
  imageBuffer,
  'images/temp/photo.jpg',
  'image/jpeg',
  true  // isPublic
);

// Upload de documento privado
const key = await uploadBuffer(
  pdfBuffer,
  'admin/temp/document.pdf',
  'application/pdf',
  false  // isPublic
);
```

## 🔐 Segurança

### Arquivos Públicos (imagens da landing page)
- ACL: `public-read`
- Acesso direto via CDN
- Cache de 1 ano
- Ideal para: imagens, CSS, JS

### Arquivos Privados (documentos administrativos)
- ACL: `private`
- Acesso apenas via URLs assinadas temporárias
- URLs expiram após tempo definido (padrão: 1 hora)
- Ideal para: PDFs, documentos, anexos sensíveis

## 💰 Custos Estimados

### Digital Ocean Spaces Pricing (2024)
- Storage: $5/mês para 250 GB
- Bandwidth: 1 TB incluído, $0.01/GB adicional
- Requests: Sem custo adicional

### Estimativa para HIBERHIT:
- Imagens: ~17 MB
- Documentos admin: ~100 MB/mês estimado
- **Custo mensal estimado: $5** (mínimo)

## 🧪 Testar a Configuração

```bash
# 1. Upload das imagens
node scripts/upload-images-to-spaces.js

# 2. Atualizar componentes
node scripts/update-components-urls.js

# 3. Testar localmente
npm run dev

# 4. Build de produção
npm run build
```

## 🐛 Troubleshooting

### Erro: "Access Denied"
- Verifique se as credenciais estão corretas no `.env`
- Confirme que a Access Key tem permissões de leitura/escrita

### Erro: "Bucket already exists"
- O bucket pode ter sido criado por outra conta
- Escolha outro nome em `DO_SPACES_BUCKET`

### Imagens não carregam
- Verifique se o CDN está ativado
- Teste a URL diretamente no navegador
- Confirme as configurações de CORS

## 📚 Recursos Úteis

- [Digital Ocean Spaces Documentation](https://docs.digitalocean.com/products/spaces/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Digital Ocean API](https://docs.digitalocean.com/reference/api/)

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs do script: `node scripts/upload-images-to-spaces.js`
2. Teste as credenciais no painel da Digital Ocean
3. Consulte a documentação oficial da Digital Ocean
