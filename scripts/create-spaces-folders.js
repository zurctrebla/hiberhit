import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const spacesClient = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT || 'https://lon1.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'lon1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || 'iberhit-assets';

/**
 * Cria "pastas" no Spaces criando objetos vazios com trailing slash
 */
async function createFolder(folderPath) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${folderPath}/`,
      Body: '',
      ContentType: 'application/x-directory',
    });

    await spacesClient.send(command);
    console.log(`✓ Pasta criada: ${folderPath}/`);
  } catch (error) {
    console.error(`✗ Erro ao criar pasta ${folderPath}:`, error.message);
  }
}

/**
 * Cria estrutura completa de pastas
 */
async function createAllFolders() {
  console.log('='.repeat(60));
  console.log('  CRIANDO ESTRUTURA DE PASTAS NO SPACES');
  console.log('='.repeat(60));
  console.log();
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log();

  const folders = [
    // Pastas públicas (já existem)
    'images/hero',
    'images/products',
    'images/authority',
    'images/projects',

    // Pastas privadas (admin)
    'admin',
    'admin/documents',
    'admin/attachments',
    'admin/plantas',
    'admin/orcamentos',
    'admin/propostas',
    'admin/contratos',

    // Backup
    'backup',
    'backup/plantas',
    'backup/documents',
  ];

  console.log('Criando pastas...');
  console.log();

  for (const folder of folders) {
    await createFolder(folder);
  }

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Estrutura de pastas criada com sucesso!');
  console.log('='.repeat(60));
  console.log();
  console.log('Estrutura criada:');
  console.log('');
  console.log('iberhit-assets/');
  console.log('├── images/              # PÚBLICO (CDN)');
  console.log('│   ├── hero/');
  console.log('│   ├── products/');
  console.log('│   ├── authority/');
  console.log('│   └── projects/');
  console.log('├── admin/               # PRIVADO (API)');
  console.log('│   ├── documents/       # Documentos gerais');
  console.log('│   ├── attachments/     # Anexos de orçamentos');
  console.log('│   ├── plantas/         # Plantas de imóveis');
  console.log('│   ├── orcamentos/      # PDFs de orçamentos');
  console.log('│   ├── propostas/       # Propostas comerciais');
  console.log('│   └── contratos/       # Contratos assinados');
  console.log('└── backup/              # Backups');
  console.log('    ├── plantas/');
  console.log('    └── documents/');
  console.log();
}

// Executar
createAllFolders().catch((error) => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
