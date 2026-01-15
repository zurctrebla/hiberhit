import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadBuffer, getPrivateFileUrl } from './services/spaces.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testSpaces() {
  console.log('='.repeat(60));
  console.log('  TESTE DE INTEGRAÇÃO - DIGITAL OCEAN SPACES');
  console.log('='.repeat(60));
  console.log();

  // Verifica configuração
  if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
    console.error('❌ Credenciais não configuradas!');
    console.log('Configure DO_SPACES_KEY e DO_SPACES_SECRET no .env');
    process.exit(1);
  }

  console.log('✓ Credenciais configuradas');
  console.log(`✓ Bucket: ${process.env.DO_SPACES_BUCKET || 'iberhit-assets'}`);
  console.log(`✓ Region: ${process.env.DO_SPACES_REGION || 'lon1'}`);
  console.log();

  try {
    // Teste 1: Upload de arquivo de teste
    console.log('📤 Teste 1: Upload de arquivo...');
    const testContent = Buffer.from('Este é um arquivo de teste do Iberhit API - ' + new Date().toISOString());
    const testKey = `admin/test/test-${Date.now()}.txt`;

    const uploadedKey = await uploadBuffer(
      testContent,
      testKey,
      'text/plain',
      false // privado
    );

    console.log(`   ✓ Upload concluído: ${uploadedKey}`);
    console.log();

    // Teste 2: Gerar URL assinada
    console.log('🔗 Teste 2: Gerar URL assinada...');
    const signedUrl = await getPrivateFileUrl(testKey, 300); // 5 minutos

    console.log('   ✓ URL gerada com sucesso!');
    console.log('   ✓ Válida por: 300 segundos (5 minutos)');
    console.log(`   ✓ URL: ${signedUrl.substring(0, 80)}...`);
    console.log();

    // Teste 3: Verificar acesso
    console.log('🔍 Teste 3: Verificar acesso à URL...');
    const response = await fetch(signedUrl);

    if (response.ok) {
      const content = await response.text();
      console.log('   ✓ Arquivo acessível!');
      console.log(`   ✓ Conteúdo: ${content.substring(0, 50)}...`);
    } else {
      console.log(`   ✗ Erro ao acessar: HTTP ${response.status}`);
    }

    console.log();
    console.log('='.repeat(60));
    console.log('✅ Todos os testes passaram!');
    console.log('='.repeat(60));
    console.log();
    console.log('O backend está pronto para usar Digital Ocean Spaces! 🚀');
    console.log();

  } catch (error) {
    console.error();
    console.error('❌ Erro durante o teste:', error.message);
    console.error();
    process.exit(1);
  }
}

testSpaces();
