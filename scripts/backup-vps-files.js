import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
 * Cria backup do banco de dados (apenas tabela quote_requests)
 */
async function backupDatabase(backupDir) {
  try {
    console.log('📊 Fazendo backup do banco de dados...');

    const result = await pool.query(
      'SELECT * FROM quote_requests WHERE planta_path IS NOT NULL ORDER BY id'
    );

    const backupFile = path.join(backupDir, `db-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(result.rows, null, 2));

    console.log(`   ✓ Backup salvo: ${backupFile}`);
    console.log(`   ✓ Total de registros: ${result.rows.length}`);

    return backupFile;
  } catch (error) {
    console.error('   ✗ Erro ao fazer backup do banco:', error.message);
    throw error;
  }
}

/**
 * Cria lista de arquivos para backup
 */
async function createFileList(vpsBasePath, backupDir) {
  try {
    console.log('📁 Criando lista de arquivos...');

    const result = await pool.query(
      `SELECT id, planta_path, nome, email, created_at
       FROM quote_requests
       WHERE planta_path IS NOT NULL
       AND planta_path != ''
       ORDER BY id`
    );

    const fileList = [];

    for (const row of result.rows) {
      const fullPath = path.join(vpsBasePath, row.planta_path);
      const exists = fs.existsSync(fullPath);
      let size = 0;

      if (exists) {
        const stats = fs.statSync(fullPath);
        size = stats.size;
      }

      fileList.push({
        id: row.id,
        nome: row.nome,
        email: row.email,
        created_at: row.created_at,
        planta_path: row.planta_path,
        full_path: fullPath,
        exists,
        size,
        size_kb: (size / 1024).toFixed(2),
      });
    }

    const listFile = path.join(backupDir, `file-list-${Date.now()}.json`);
    fs.writeFileSync(listFile, JSON.stringify(fileList, null, 2));

    console.log(`   ✓ Lista salva: ${listFile}`);
    console.log(`   ✓ Total de arquivos: ${fileList.length}`);
    console.log(`   ✓ Arquivos existentes: ${fileList.filter(f => f.exists).length}`);
    console.log(`   ✓ Arquivos faltando: ${fileList.filter(f => !f.exists).length}`);

    const totalSize = fileList.reduce((sum, f) => sum + f.size, 0);
    console.log(`   ✓ Tamanho total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    return { listFile, fileList };
  } catch (error) {
    console.error('   ✗ Erro ao criar lista:', error.message);
    throw error;
  }
}

/**
 * Cria script de cópia dos arquivos
 */
function createCopyScript(fileList, vpsBasePath, backupDir) {
  try {
    console.log('📝 Criando script de cópia...');

    const scriptPath = path.join(backupDir, `copy-files-${Date.now()}.sh`);
    const lines = [
      '#!/bin/bash',
      '# Script de cópia de arquivos da VPS',
      '# Gerado automaticamente em ' + new Date().toISOString(),
      '',
      `BACKUP_DIR="${backupDir}/files"`,
      'mkdir -p "$BACKUP_DIR"',
      '',
      'echo "Copiando arquivos..."',
      'echo ""',
      '',
    ];

    fileList.filter(f => f.exists).forEach((file, index) => {
      lines.push(`echo "[${index + 1}/${fileList.length}] ${file.planta_path}"`);
      lines.push(`cp "${file.full_path}" "$BACKUP_DIR/${path.basename(file.planta_path)}"`);
      lines.push('');
    });

    lines.push('echo ""');
    lines.push('echo "✅ Cópia concluída!"');
    lines.push(`echo "Arquivos salvos em: $BACKUP_DIR"`);

    fs.writeFileSync(scriptPath, lines.join('\n'));
    fs.chmodSync(scriptPath, '755');

    console.log(`   ✓ Script salvo: ${scriptPath}`);
    console.log(`   ✓ Execute: bash ${scriptPath}`);

    return scriptPath;
  } catch (error) {
    console.error('   ✗ Erro ao criar script:', error.message);
    throw error;
  }
}

/**
 * Função principal
 */
async function backup(vpsBasePath) {
  console.log('='.repeat(70));
  console.log('  BACKUP DE ARQUIVOS DA VPS');
  console.log('='.repeat(70));
  console.log();

  // Cria diretório de backup
  const backupDir = path.join(__dirname, `backup-${Date.now()}`);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`📂 Diretório de backup: ${backupDir}`);
  console.log();

  try {
    // 1. Backup do banco
    const dbBackup = await backupDatabase(backupDir);
    console.log();

    // 2. Lista de arquivos
    const { listFile, fileList } = await createFileList(vpsBasePath, backupDir);
    console.log();

    // 3. Script de cópia
    const scriptPath = createCopyScript(fileList, vpsBasePath, backupDir);
    console.log();

    // Resumo
    console.log('='.repeat(70));
    console.log('✅ BACKUP PREPARADO COM SUCESSO');
    console.log('='.repeat(70));
    console.log();
    console.log('📁 Arquivos criados:');
    console.log(`   - Banco de dados: ${dbBackup}`);
    console.log(`   - Lista de arquivos: ${listFile}`);
    console.log(`   - Script de cópia: ${scriptPath}`);
    console.log();
    console.log('📝 Próximos passos:');
    console.log(`   1. Execute o script de cópia (se estiver na VPS):`);
    console.log(`      bash ${scriptPath}`);
    console.log();
    console.log(`   2. Ou copie os arquivos manualmente`);
    console.log();
    console.log(`   3. Execute a migração:`);
    console.log(`      node scripts/migrate-vps-files-to-spaces.js ${vpsBasePath}`);
    console.log();

  } catch (error) {
    console.error('❌ Erro no backup:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execução
const args = process.argv.slice(2);
const vpsBasePath = args[0] || '/mnt/volume_lon1_01/uploads/public';

backup(vpsBasePath).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
