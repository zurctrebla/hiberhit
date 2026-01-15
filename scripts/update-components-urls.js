import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CDN_ENDPOINT = process.env.DO_SPACES_CDN_ENDPOINT || 'https://iberhit-assets.lon1.cdn.digitaloceanspaces.com';

/**
 * Atualiza as URLs nos componentes React
 */
async function updateComponents() {
  console.log('='.repeat(60));
  console.log('  ATUALIZAR URLs DOS COMPONENTES COM CDN');
  console.log('='.repeat(60));
  console.log();

  // Lê o arquivo de mapeamento de URLs
  const urlsFilePath = path.join(__dirname, 'cdn-urls.json');

  if (!fs.existsSync(urlsFilePath)) {
    console.error('❌ Arquivo cdn-urls.json não encontrado!');
    console.log('Execute primeiro: node scripts/upload-images-to-spaces.js');
    process.exit(1);
  }

  const urls = JSON.parse(fs.readFileSync(urlsFilePath, 'utf8'));

  // Atualizar HeroSection
  console.log('📝 Atualizando HeroSection.tsx...');
  updateHeroSection(urls);

  // Atualizar ProductsSection
  console.log('📝 Atualizando ProductsSection.tsx...');
  updateProductsSection(urls);

  // Atualizar AuthoritySection
  console.log('📝 Atualizando AuthoritySection.tsx...');
  updateAuthoritySection(urls);

  // Atualizar IconicProjectsSection
  console.log('📝 Atualizando IconicProjectsSection.tsx...');
  updateIconicProjectsSection(urls);

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Componentes atualizados com sucesso!');
  console.log('='.repeat(60));
  console.log();
  console.log('Teste o site localmente:');
  console.log('  npm run dev');
  console.log();
}

function updateHeroSection(urls) {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'home', 'components', 'HeroSection.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /src="\/images\/hero\/hero-desktop\.jpg"/,
    `src="${urls.hero['hero-desktop.jpg']}"`
  );

  content = content.replace(
    /src="\/images\/hero\/hero-mobile\.jpg"/,
    `src="${urls.hero['hero-mobile.jpg']}"`
  );

  fs.writeFileSync(filePath, content);
  console.log('  ✓ HeroSection atualizado');
}

function updateProductsSection(urls) {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'home', 'components', 'ProductsSection.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /image: '\/images\/products\/cabo-radiante\.png'/,
    `image: '${urls.products['cabo-radiante.png']}'`
  );

  content = content.replace(
    /image: '\/images\/products\/esteira-radiante\.webp'/,
    `image: '${urls.products['esteira-radiante.webp']}'`
  );

  content = content.replace(
    /image: '\/images\/products\/manta-al-radiante\.png'/,
    `image: '${urls.products['manta-al-radiante.png']}'`
  );

  content = content.replace(
    /image: '\/images\/products\/pelicula-radiante-ecofilm\.webp'/,
    `image: '${urls.products['pelicula-radiante-ecofilm.webp']}'`
  );

  fs.writeFileSync(filePath, content);
  console.log('  ✓ ProductsSection atualizado');
}

function updateAuthoritySection(urls) {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'home', 'components', 'AuthoritySection.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /src="\/images\/authority\/equipa-tecnica\.jpg"/,
    `src="${urls.authority['equipa-tecnica.jpg']}"`
  );

  fs.writeFileSync(filePath, content);
  console.log('  ✓ AuthoritySection atualizado');
}

function updateIconicProjectsSection(urls) {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'home', 'components', 'IconicProjectsSection.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /image: '\/images\/projects\/hotel-k2\.jpg'/,
    `image: '${urls.projects['hotel-k2.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/mnac\.jpg'/,
    `image: '${urls.projects['mnac.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/torre-agbar\.jpg'/,
    `image: '${urls.projects['torre-agbar.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/san-marco\.jpg'/,
    `image: '${urls.projects['san-marco.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/park-hyatt\.jpg'/,
    `image: '${urls.projects['park-hyatt.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/sagrada-familia\.jpg'/,
    `image: '${urls.projects['sagrada-familia.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/edificio-intempo\.jpg'/,
    `image: '${urls.projects['edificio-intempo.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/zoo-barcelona\.jpg'/,
    `image: '${urls.projects['zoo-barcelona.jpg']}'`
  );

  content = content.replace(
    /image: '\/images\/projects\/heliporto-hospitalar\.jpg'/,
    `image: '${urls.projects['heliporto-hospitalar.jpg']}'`
  );

  fs.writeFileSync(filePath, content);
  console.log('  ✓ IconicProjectsSection atualizado');
}

updateComponents();
