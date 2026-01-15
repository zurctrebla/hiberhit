import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuração do Spaces
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

// Configuração do banco de dados
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Faz upload de um arquivo para o Spaces
 */
async function uploadToSpaces(localPath, key, contentType) {
  try {
    const fileStream = fs.createReadStream(localPath);
    const fileStats = fs.statSync(localPath);

    console.log(`    Fazendo upload: ${key} (${(fileStats.size / 1024).toFixed(2)} KB)`);

    const upload = new Upload({
      client: spacesClient,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ACL: 'private',
        ContentType: contentType,
        ContentLength: fileStats.size,
      },
    });

    await upload.done();
    console.log(`    ✓ Upload concluído: ${key}`);
    return key;
  } catch (error) {
    console.error(`    ✗ Erro no upload: ${error.message}`);
    throw error;
  }
}

/**
 * Detecta tipo MIME do arquivo
 */
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.dwg': 'application/acad',
    '.dxf': 'application/dxf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Migra um arquivo individual
 */
async function migrateFile(quoteId, plantaPath, vpsBasePath) {
  try {
    // Caminho completo na VPS
    const fullPath = path.join(vpsBasePath, plantaPath);

    // Verifica se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      console.log(`    ⚠️  Arquivo não encontrado: ${fullPath}`);
      return null;
    }

    // Gera nova chave no Spaces
    const ext = path.extname(plantaPath);
    const newKey = `admin/plantas/migrated-${quoteId}-${Date.now()}${ext}`;
    const contentType = getContentType(plantaPath);

    // Faz upload
    await uploadToSpaces(fullPath, newKey, contentType);

    // Atualiza banco de dados
    await pool.query(
      `UPDATE quote_requests
       SET planta_path = $1,
           planta_url = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [newKey, quoteId]
    );

    console.log(`    ✓ Banco atualizado: planta_path = ${newKey}`);

    return {
      quoteId,
      oldPath: plantaPath,
      newKey,
      success: true,
    };
  } catch (error) {
    console.error(`    ✗ Erro ao migrar: ${error.message}`);
    return {
      quoteId,
      oldPath: plantaPath,
      error: error.message,
      success: false,
    };
  }
}

/**
 * Função principal de migração
 */
async function migrate(vpsBasePath, dryRun = false) {
  console.log('='.repeat(70));
  console.log('  MIGRAÇÃO DE ARQUIVOS DA VPS PARA DIGITAL OCEAN SPACES');
  console.log('='.repeat(70));
  console.log();

  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN: Nenhuma alteração será feita');
    console.log();
  }

  // Verifica configuração
  if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
    console.error('❌ Credenciais do Spaces não configuradas!');
    console.log('Configure DO_SPACES_KEY e DO_SPACES_SECRET no .env');
    process.exit(1);
  }

  if (!fs.existsSync(vpsBasePath)) {
    console.error(`❌ Caminho da VPS não encontrado: ${vpsBasePath}`);
    console.log('');
    console.log('Opções:');
    console.log('  1. Se está rodando na VPS, use o caminho correto (ex: /mnt/volume_lon1_01/uploads/public)');
    console.log('  2. Se está rodando localmente, monte o volume primeiro ou use rsync/scp');
    process.exit(1);
  }

  console.log(`✓ Caminho da VPS: ${vpsBasePath}`);
  console.log(`✓ Bucket: ${BUCKET_NAME}`);
  console.log(`✓ Banco: ${process.env.DB_HOST}`);
  console.log();

  try {
    // Busca todos os registros com planta_path não nulo
    const result = await pool.query(
      `SELECT id, planta_path, planta_url, nome
       FROM quote_requests
       WHERE planta_path IS NOT NULL
       AND planta_path != ''
       ORDER BY id`
    );

    const total = result.rows.length;
    console.log(`📊 Total de registros com plantas: ${total}`);
    console.log();

    if (total === 0) {
      console.log('ℹ️  Nenhum registro para migrar.');
      return;
    }

    // Confirma antes de prosseguir
    if (!dryRun) {
      console.log('⚠️  ATENÇÃO: Esta operação irá:');
      console.log('   1. Fazer upload dos arquivos para o Spaces');
      console.log('   2. Atualizar o banco de dados com os novos caminhos');
      console.log('   3. Os arquivos originais NÃO serão deletados (backup manual)');
      console.log();
      console.log('⏸️  Pressione Ctrl+C para cancelar ou Enter para continuar...');

      // Aguarda confirmação
      await new Promise(resolve => {
        process.stdin.once('data', () => resolve());
      });
    }

    console.log();
    console.log('🚀 Iniciando migração...');
    console.log();

    const results = {
      success: [],
      failed: [],
      skipped: [],
    };

    // Migra cada arquivo
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      console.log(`[${i + 1}/${total}] Orçamento #${row.id} - ${row.nome}`);
      console.log(`    Arquivo atual: ${row.planta_path}`);

      if (dryRun) {
        console.log('    [DRY-RUN] Simulando migração...');
        results.skipped.push(row.id);
      } else {
        const result = await migrateFile(row.id, row.planta_path, vpsBasePath);

        if (result && result.success) {
          results.success.push(result);
        } else if (result && !result.success) {
          results.failed.push(result);
        } else {
          results.skipped.push(row.id);
        }
      }

      console.log();
    }

    // Resumo final
    console.log('='.repeat(70));
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(70));
    console.log();
    console.log(`✅ Sucesso: ${results.success.length}`);
    console.log(`❌ Falhas: ${results.failed.length}`);
    console.log(`⏭️  Ignorados: ${results.skipped.length}`);
    console.log(`📦 Total: ${total}`);
    console.log();

    if (results.failed.length > 0) {
      console.log('❌ Arquivos que falharam:');
      results.failed.forEach(r => {
        console.log(`   - Orçamento #${r.quoteId}: ${r.error}`);
      });
      console.log();
    }

    if (results.success.length > 0) {
      console.log('✅ Arquivos migrados com sucesso:');
      results.success.forEach(r => {
        console.log(`   - Orçamento #${r.quoteId}: ${r.oldPath} → ${r.newKey}`);
      });
      console.log();
    }

    // Salva log
    const logPath = path.join(__dirname, `migration-log-${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
    console.log(`📄 Log salvo em: ${logPath}`);
    console.log();

    console.log('='.repeat(70));
    console.log('✅ Migração concluída!');
    console.log('='.repeat(70));
    console.log();
    console.log('⚠️  IMPORTANTE: Os arquivos originais NÃO foram deletados.');
    console.log('   Faça backup manual antes de remover da VPS.');
    console.log();

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execução
const args = process.argv.slice(2);
const vpsBasePath = args[0] || '/mnt/volume_lon1_01/uploads/public';
const dryRun = args.includes('--dry-run');

console.log();
console.log('Uso:');
console.log('  node migrate-vps-files-to-spaces.js [caminho-vps] [--dry-run]');
console.log();
console.log('Exemplos:');
console.log('  node migrate-vps-files-to-spaces.js /mnt/volume_lon1_01/uploads/public');
console.log('  node migrate-vps-files-to-spaces.js /mnt/volume_lon1_01/uploads/public --dry-run');
console.log();

migrate(vpsBasePath, dryRun).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
