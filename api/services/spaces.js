import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
 * Upload de arquivo público (imagens da landing page)
 * @param {string} filePath - Caminho local do arquivo
 * @param {string} key - Caminho no bucket (ex: 'images/hero/hero-desktop.jpg')
 * @param {string} contentType - Tipo MIME do arquivo
 * @returns {Promise<string>} URL pública do CDN
 */
export async function uploadPublicFile(filePath, key, contentType) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    const upload = new Upload({
      client: spacesClient,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ACL: 'public-read', // Acesso público
        ContentType: contentType,
        ContentLength: fileStats.size,
        CacheControl: 'public, max-age=31536000', // Cache de 1 ano para imagens
      },
    });

    await upload.done();

    // Retorna a URL do CDN
    return `${CDN_ENDPOINT}/${key}`;
  } catch (error) {
    console.error('Erro ao fazer upload público:', error);
    throw error;
  }
}

/**
 * Upload de arquivo privado (documentos administrativos)
 * @param {string} filePath - Caminho local do arquivo
 * @param {string} key - Caminho no bucket (ex: 'admin/documents/orcamento-123.pdf')
 * @param {string} contentType - Tipo MIME do arquivo
 * @returns {Promise<string>} Chave do arquivo no bucket
 */
export async function uploadPrivateFile(filePath, key, contentType) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    const upload = new Upload({
      client: spacesClient,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ACL: 'private', // Acesso privado
        ContentType: contentType,
        ContentLength: fileStats.size,
      },
    });

    await upload.done();

    return key;
  } catch (error) {
    console.error('Erro ao fazer upload privado:', error);
    throw error;
  }
}

/**
 * Gera URL assinada temporária para acesso a arquivo privado
 * @param {string} key - Chave do arquivo no bucket
 * @param {number} expiresIn - Tempo de expiração em segundos (padrão: 1 hora)
 * @returns {Promise<string>} URL assinada temporária
 */
export async function getPrivateFileUrl(key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(spacesClient, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    throw error;
  }
}

/**
 * Upload de buffer direto (útil para arquivos em memória)
 * @param {Buffer} buffer - Buffer do arquivo
 * @param {string} key - Caminho no bucket
 * @param {string} contentType - Tipo MIME do arquivo
 * @param {boolean} isPublic - Se o arquivo deve ser público
 * @returns {Promise<string>} URL do CDN (se público) ou chave (se privado)
 */
export async function uploadBuffer(buffer, key, contentType, isPublic = false) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ACL: isPublic ? 'public-read' : 'private',
      ContentType: contentType,
      CacheControl: isPublic ? 'public, max-age=31536000' : undefined,
    });

    await spacesClient.send(command);

    if (isPublic) {
      return `${CDN_ENDPOINT}/${key}`;
    }
    return key;
  } catch (error) {
    console.error('Erro ao fazer upload de buffer:', error);
    throw error;
  }
}

/**
 * Deleta arquivo do bucket
 * @param {string} key - Chave do arquivo no bucket
 * @returns {Promise<void>}
 */
export async function deleteFile(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await spacesClient.send(command);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
}

/**
 * Lista arquivos em um diretório
 * @param {string} prefix - Prefixo/diretório (ex: 'admin/documents/')
 * @returns {Promise<Array>} Lista de arquivos
 */
export async function listFiles(prefix = '') {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await spacesClient.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    throw error;
  }
}

/**
 * Obtém o tipo MIME baseado na extensão do arquivo
 * @param {string} filename - Nome do arquivo
 * @returns {string} Tipo MIME
 */
export function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.zip': 'application/zip',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export default {
  uploadPublicFile,
  uploadPrivateFile,
  getPrivateFileUrl,
  uploadBuffer,
  deleteFile,
  listFiles,
  getContentType,
};
