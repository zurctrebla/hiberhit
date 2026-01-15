# Backend - Guia de Uso do Digital Ocean Spaces

## 📦 Configuração Completa

### ✅ O que foi implementado:

1. **Upload de Plantas** (`/api/quotes/submit`)
   - Upload automático para `admin/plantas/` (privado)
   - Fallback para storage local se Spaces não configurado
   - Suporta: PDF, JPG, PNG, DWG, DXF

2. **Download de Plantas** (`/api/admin/quotes/:id/planta`)
   - Gera URL assinada temporária (válida por 1 hora)
   - Acesso apenas com autenticação (JWT)

3. **Upload Genérico** (`/api/uploads/document`)
   - Upload de qualquer documento privado
   - Requer autenticação

4. **Estrutura de Pastas no Bucket**
   ```
   iberhit-assets/
   ├── images/              # PÚBLICO (CDN)
   ├── admin/               # PRIVADO (API)
   │   ├── plantas/         # Plantas de imóveis
   │   ├── orcamentos/      # PDFs de orçamentos
   │   ├── propostas/       # Propostas comerciais
   │   ├── contratos/       # Contratos assinados
   │   ├── documents/       # Documentos gerais
   │   └── attachments/     # Anexos
   └── backup/              # Backups
   ```

## 🚀 Como Usar

### 1. Upload de Planta (Frontend → Backend)

**Endpoint:** `POST /api/quotes/submit`

```javascript
const formData = new FormData();
formData.append('nome', 'João Silva');
formData.append('email', 'joao@example.com');
formData.append('area', '100');
// ... outros campos ...
formData.append('planta', fileInput.files[0]); // Arquivo

const response = await fetch('/api/quotes/submit', {
  method: 'POST',
  body: formData,
});
```

**O que acontece:**
1. ✅ Arquivo enviado via multipart/form-data
2. ✅ Backend faz upload para `admin/plantas/timestamp-uuid.pdf`
3. ✅ Salva `planta_path` no banco de dados
4. ✅ `planta_url` fica `null` (URL gerada sob demanda)

### 2. Download de Planta (Admin)

**Endpoint:** `GET /api/admin/quotes/:id/planta`

```javascript
// Buscar URL temporária
const response = await fetch('/api/admin/quotes/123/planta', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
// {
//   success: true,
//   downloadUrl: "https://iberhit-assets.lon1.digitaloceanspaces.com/admin/plantas/...",
//   expiresIn: 3600,
//   storage: "spaces"
// }

// Usar URL para download ou preview
window.open(data.downloadUrl, '_blank');
```

**O que acontece:**
1. ✅ Admin autenticado solicita planta
2. ✅ Backend gera URL assinada (válida por 1 hora)
3. ✅ Frontend usa URL para download/preview
4. ✅ URL expira após 1 hora (segurança)

### 3. Upload de Documento Genérico

**Endpoint:** `POST /api/uploads/document`

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('quoteId', '123');
formData.append('type', 'document'); // ou 'orcamento', 'proposta', etc

const response = await fetch('/api/uploads/document', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const data = await response.json();
// {
//   success: true,
//   fileKey: "admin/documents/123-1234567890.pdf",
//   filename: "original-name.pdf",
//   size: 1024000,
//   storage: "spaces"
// }
```

### 4. Download de Documento Genérico

**Endpoint:** `GET /api/uploads/document/:fileKey`

```javascript
const fileKey = 'admin/documents/123-1234567890.pdf';
const response = await fetch(`/api/uploads/document/${fileKey}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
// {
//   success: true,
//   downloadUrl: "https://...",
//   expiresIn: 3600
// }
```

## 🔒 Segurança

### Arquivos Privados
- ✅ ACL: `private`
- ✅ Acesso apenas via URLs assinadas
- ✅ URLs expiram em 1 hora
- ✅ Requer autenticação JWT

### Arquivos Públicos (Imagens)
- ✅ ACL: `public-read`
- ✅ Acesso direto via CDN
- ✅ Cache de 1 ano

## 📝 Exemplos de Uso no Frontend Admin

### React - Visualizar Planta no Dashboard

```jsx
import { useState, useEffect } from 'react';

function QuoteDetail({ quoteId }) {
  const [plantaUrl, setPlantaUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPlanta = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quotes/${quoteId}/planta`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlantaUrl(data.downloadUrl);
      }
    } catch (error) {
      console.error('Erro ao carregar planta:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanta();
  }, [quoteId]);

  if (loading) return <p>Carregando planta...</p>;
  if (!plantaUrl) return <p>Sem planta anexada</p>;

  return (
    <div>
      <h3>Planta do Imóvel</h3>
      <a href={plantaUrl} target="_blank" rel="noopener noreferrer">
        <button>Visualizar Planta</button>
      </a>
      {plantaUrl.endsWith('.pdf') ? (
        <embed src={plantaUrl} type="application/pdf" width="100%" height="600px" />
      ) : (
        <img src={plantaUrl} alt="Planta" style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
}
```

## 🧪 Testar a Integração

### 1. Criar um orçamento com planta

```bash
curl -X POST http://localhost:3001/api/quotes/submit \
  -F "nome=João Silva" \
  -F "email=joao@example.com" \
  -F "area=100" \
  -F "localizacao=Lisboa" \
  -F "tipo_imovel=apartamento" \
  -F "exposicao_solar=norte" \
  -F "tipo_pavimento=ceramico" \
  -F "possui_planta=sim" \
  -F "planta=@/path/to/planta.pdf"
```

### 2. Login admin

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

### 3. Obter URL da planta

```bash
curl -X GET http://localhost:3001/api/admin/quotes/1/planta \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 💾 Migração de Arquivos Existentes

Se você já tem plantas/documentos locais e quer migrar para o Spaces:

```javascript
// Script de migração (criar em scripts/migrate-files-to-spaces.js)
import fs from 'fs';
import path from 'path';
import pool from '../api/config/database.js';
import { uploadBuffer } from '../api/services/spaces.js';

async function migrateFiles() {
  const result = await pool.query(
    'SELECT id, planta_path FROM quote_requests WHERE planta_path IS NOT NULL'
  );

  for (const row of result.rows) {
    const localPath = path.join('./uploads', row.planta_path);

    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      const ext = path.extname(row.planta_path);
      const newKey = `admin/plantas/${Date.now()}-${row.id}${ext}`;

      await uploadBuffer(buffer, newKey, 'application/pdf', false);

      await pool.query(
        'UPDATE quote_requests SET planta_path = $1, planta_url = NULL WHERE id = $2',
        [newKey, row.id]
      );

      console.log(`✓ Migrado: ${row.planta_path} → ${newKey}`);
    }
  }
}
```

## 🔄 Fallback para Storage Local

O sistema tem fallback automático:

- **Se Spaces configurado:** Upload para Spaces
- **Se Spaces não configurado:** Upload local (compatibilidade)

Para desabilitar Spaces temporariamente, basta remover as variáveis do `.env`:

```bash
# Comentar para usar storage local
# DO_SPACES_KEY=...
# DO_SPACES_SECRET=...
```

## 📚 Referências

- [Digital Ocean Spaces API](https://docs.digitalocean.com/products/spaces/)
- [AWS SDK v3 (S3 Client)](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

## 🆘 Troubleshooting

### Erro: "Access Denied" ao fazer upload
- Verifique as credenciais no `.env`
- Confirme que a Spaces Key tem permissões de leitura/escrita

### Planta não aparece no admin
- Verifique se a rota `/api/admin/quotes/:id/planta` está sendo chamada
- Confirme autenticação JWT
- Veja console do backend para erros

### URL assinada expira muito rápido
- Ajuste o parâmetro `expiresIn` em `getPrivateFileUrl(key, 3600)`
- Valor em segundos: 3600 = 1 hora

---

**Tudo pronto!** O backend agora está integrado com o Digital Ocean Spaces. 🚀
