# Scripts de Upload para Digital Ocean Spaces

## 🚀 Início Rápido

### 1. Obter Credenciais

Acesse https://cloud.digitalocean.com/account/api/tokens e crie uma Spaces Key.

### 2. Configurar .env

Adicione no arquivo `.env` na raiz do projeto:

```bash
DO_SPACES_KEY=sua-access-key-aqui
DO_SPACES_SECRET=sua-secret-key-aqui
DO_SPACES_BUCKET=iberhit-assets
DO_SPACES_REGION=lon1
DO_SPACES_ENDPOINT=https://lon1.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://iberhit-assets.lon1.cdn.digitaloceanspaces.com
```

### 3. Executar Upload

```bash
# Opção 1: Fazer tudo de uma vez
npm run spaces:setup

# Opção 2: Passo a passo
npm run spaces:upload    # Upload das imagens
npm run spaces:update    # Atualiza componentes
```

## 📁 O que os scripts fazem?

### `upload-images-to-spaces.js`
- ✅ Cria o bucket `iberhit-assets` se não existir
- ✅ Configura CORS para acesso público
- ✅ Faz upload de todas as imagens de `public/images/`
- ✅ Gera arquivo `cdn-urls.json` com todas as URLs

### `update-components-urls.js`
- ✅ Lê o arquivo `cdn-urls.json`
- ✅ Atualiza todos os componentes React com URLs do CDN
- ✅ Substitui URLs locais por URLs do Spaces

## 🔐 Segurança

### Imagens Públicas (Landing Page)
- ✅ ACL: `public-read`
- ✅ Acesso direto via CDN
- ✅ Cache de 1 ano

### Documentos Privados (Admin)
- ✅ ACL: `private`
- ✅ URLs assinadas temporárias
- ✅ Acesso via API autenticada

## 🌐 API de Upload

### Fazer Upload de Documento (privado)

```bash
POST /api/uploads/document
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  file: <arquivo>,
  quoteId: "123",
  type: "document"
}
```

### Gerar URL Temporária

```bash
GET /api/uploads/document/admin/documents/file.pdf
Authorization: Bearer {token}

Response:
{
  "success": true,
  "downloadUrl": "https://...",
  "expiresIn": 3600
}
```

## 📚 Documentação Completa

Veja `DIGITAL_OCEAN_SETUP.md` na raiz do projeto para documentação detalhada.
