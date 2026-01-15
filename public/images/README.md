# Imagens do Projeto

⚠️ **ATENÇÃO**: As imagens deste projeto agora estão hospedadas no **Digital Ocean Spaces** com CDN.

## 📍 Localização Atual

Todas as imagens da landing page estão disponíveis em:
```
https://iberhit-assets.lon1.cdn.digitaloceanspaces.com/images/
```

## 📁 Estrutura no CDN

```
images/
├── hero/
│   ├── hero-desktop.jpg
│   └── hero-mobile.jpg
├── products/
│   ├── cabo-radiante.png
│   ├── esteira-radiante.webp
│   ├── manta-al-radiante.png
│   └── pelicula-radiante-ecofilm.webp
├── authority/
│   └── equipa-tecnica.jpg
└── projects/
    ├── hotel-k2.jpg
    ├── mnac.jpg
    ├── torre-agbar.jpg
    ├── san-marco.jpg
    ├── park-hyatt.jpg
    ├── sagrada-familia.jpg
    ├── edificio-intempo.jpg
    ├── zoo-barcelona.jpg
    └── heliporto-hospitalar.jpg
```

## 🔄 Como Adicionar/Atualizar Imagens

### Opção 1: Via Script (Recomendado)
```bash
# 1. Adicione as novas imagens em public/images/
# 2. Execute o upload
npm run spaces:upload

# 3. Atualize os componentes
npm run spaces:update
```

### Opção 2: Painel Digital Ocean
1. Acesse: https://cloud.digitalocean.com/spaces/iberhit-assets
2. Navegue até a pasta desejada
3. Faça upload manual
4. Atualize as URLs nos componentes

## 📚 Documentação Completa

Veja `DIGITAL_OCEAN_SETUP.md` na raiz do projeto.
