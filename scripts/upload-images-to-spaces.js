import { S3Client, PutObjectCommand, CreateBucketCommand, PutBucketCorsCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do cliente S3 para Digital Ocean Spaces
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
const CDN_ENDPOINT = process.env.DO_SPACES_CDN_ENDPOINT || `https://${BUCKET_NAME}.lon1.cdn.digitaloceanspaces.com`;

/**
 * Verifica se o bucket existe
 */
async function checkBucketExists() {
  try {
    const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await spacesClient.send(command);
    console.log(`✓ Bucket '${BUCKET_NAME}' já existe`);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Cria o bucket se não existir
 */
async function createBucketIfNotExists() {
  const exists = await checkBucketExists();

  if (!exists) {
    console.log(`Criando bucket '${BUCKET_NAME}'...`);
    try {
      const command = new CreateBucketCommand({
        Bucket: BUCKET_NAME,
        ACL: 'public-read',
      });
      await spacesClient.send(command);
      console.log(`✓ Bucket '${BUCKET_NAME}' criado com sucesso`);

      // Aguarda um pouco para o bucket ser provisionado
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Erro ao criar bucket:', error.message);
      throw error;
    }
  }
}

/**
 * Configura CORS para o bucket
 */
async function configureCORS() {
  console.log('Configurando CORS...');
  try {
    const corsCommand = new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedHeaders: ['*'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    });
    await spacesClient.send(corsCommand);
    console.log('✓ CORS configurado com sucesso');
  } catch (error) {
    console.error('Erro ao configurar CORS:', error.message);
  }
}

/**
 * Obtém o tipo MIME baseado na extensão do arquivo
 */
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Faz upload de um arquivo
 */
async function uploadFile(localPath, remotePath) {
  try {
    const fileStream = fs.createReadStream(localPath);
    const fileStats = fs.statSync(localPath);
    const contentType = getContentType(localPath);

    console.log(`  Uploading: ${remotePath} (${(fileStats.size / 1024).toFixed(2)} KB)`);

    const upload = new Upload({
      client: spacesClient,
      params: {
        Bucket: BUCKET_NAME,
        Key: remotePath,
        Body: fileStream,
        ACL: 'public-read',
        ContentType: contentType,
        ContentLength: fileStats.size,
        CacheControl: 'public, max-age=31536000',
      },
    });

    await upload.done();

    const cdnUrl = `${CDN_ENDPOINT}/${remotePath}`;
    console.log(`  ✓ URL: ${cdnUrl}`);
    return cdnUrl;
  } catch (error) {
    console.error(`  ✗ Erro ao fazer upload de ${remotePath}:`, error.message);
    throw error;
  }
}

/**
 * Faz upload de todos os arquivos de um diretório
 */
async function uploadDirectory(localDir, remoteDir) {
  const files = fs.readdirSync(localDir);
  const urls = {};

  for (const file of files) {
    const localPath = path.join(localDir, file);
    const remotePath = `${remoteDir}/${file}`;

    if (fs.statSync(localPath).isFile()) {
      const url = await uploadFile(localPath, remotePath);
      urls[file] = url;
    }
  }

  return urls;
}

/**
 * Função principal
 */
async function main() {
  console.log('='.repeat(60));
  console.log('  UPLOAD DE IMAGENS PARA DIGITAL OCEAN SPACES');
  console.log('='.repeat(60));
  console.log();

  // Verifica se as credenciais estão configuradas
  if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
    console.error('❌ Erro: Credenciais do Digital Ocean Spaces não configuradas!');
    console.log();
    console.log('Por favor, adicione as seguintes variáveis no arquivo .env:');
    console.log('  DO_SPACES_KEY=your-spaces-access-key');
    console.log('  DO_SPACES_SECRET=your-spaces-secret-key');
    console.log();
    console.log('Para obter as credenciais:');
    console.log('  1. Acesse https://cloud.digitalocean.com/account/api/tokens');
    console.log('  2. Clique em "Generate New Key" na seção Spaces Keys');
    console.log('  3. Copie a Access Key e Secret Key');
    process.exit(1);
  }

  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${process.env.DO_SPACES_REGION}`);
  console.log(`CDN: ${CDN_ENDPOINT}`);
  console.log();

  try {
    // Cria o bucket se não existir
    await createBucketIfNotExists();

    // Configura CORS
    await configureCORS();

    console.log();
    console.log('Fazendo upload das imagens...');
    console.log();

    const publicDir = path.join(__dirname, '..', 'public', 'images');
    const allUrls = {};

    // Upload Hero Images
    console.log('📸 Hero Images:');
    const heroUrls = await uploadDirectory(
      path.join(publicDir, 'hero'),
      'images/hero'
    );
    allUrls.hero = heroUrls;

    console.log();

    // Upload Products Images
    console.log('📦 Products Images:');
    const productsUrls = await uploadDirectory(
      path.join(publicDir, 'products'),
      'images/products'
    );
    allUrls.products = productsUrls;

    console.log();

    // Upload Authority Images
    console.log('👷 Authority Images:');
    const authorityUrls = await uploadDirectory(
      path.join(publicDir, 'authority'),
      'images/authority'
    );
    allUrls.authority = authorityUrls;

    console.log();

    // Upload Projects Images
    console.log('🏗️  Projects Images:');
    const projectsUrls = await uploadDirectory(
      path.join(publicDir, 'projects'),
      'images/projects'
    );
    allUrls.projects = projectsUrls;

    console.log();
    console.log('='.repeat(60));
    console.log('✅ Upload concluído com sucesso!');
    console.log('='.repeat(60));
    console.log();

    // Salva o mapeamento de URLs em um arquivo JSON
    const urlsFilePath = path.join(__dirname, 'cdn-urls.json');
    fs.writeFileSync(urlsFilePath, JSON.stringify(allUrls, null, 2));
    console.log(`📄 Mapeamento de URLs salvo em: ${urlsFilePath}`);
    console.log();

    console.log('Próximos passos:');
    console.log('  1. Ative o CDN no painel do Digital Ocean');
    console.log('  2. Execute: node scripts/update-components-urls.js');
    console.log('     (para atualizar os componentes com as URLs do CDN)');
    console.log();

  } catch (error) {
    console.error();
    console.error('❌ Erro durante o upload:', error.message);
    process.exit(1);
  }
}

main();
