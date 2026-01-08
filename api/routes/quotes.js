import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { sendQuoteNotification } from '../services/email.js';

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// garantir que a pasta existe
function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (_) {}
}

// Configurar multer para upload de ficheiros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|dwg|dxf/;
    const extname = allowedTypes.test(path.extname(file.originalname || '').toLowerCase());
    const mimetype = allowedTypes.test((file.mimetype || '').toLowerCase());

    if (mimetype && extname) return cb(null, true);
    cb(new Error('Tipo de ficheiro não permitido'));
  },
});

// Multer só quando for multipart
const maybeUpload = (req, res, next) => {
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (ct.includes('multipart/form-data')) {
    return upload.single('planta')(req, res, next);
  }
  return next();
};

function isPresent(v) {
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  return true;
}

// Submeter pedido de orçamento
router.post('/submit', maybeUpload, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const body = req.body || {};

    // Aceitar camelCase e snake_case (front manda snake_case, curl às vezes camelCase)
    const normalized = {
      // obrigatórios no DB
      nome: body.nome,
      email: body.email,
      localizacao: body.localizacao,
      tipo_imovel: body.tipo_imovel ?? body.tipoImovel,
      exposicao_solar: body.exposicao_solar ?? body.exposicaoSolar,
      area: body.area,
      tipo_pavimento: body.tipo_pavimento ?? body.tipoPavimento,
      possui_planta: body.possui_planta ?? body.possuiPlanta,

      // opcionais no DB
      telemovel: body.telemovel,
      ultimo_piso: body.ultimo_piso ?? body.ultimoPiso,
      nivel_isolamento: body.nivel_isolamento ?? body.nivelIsolamento,
      zona_fria: body.zona_fria ?? body.zonaFria,
      sinais_humidade: body.sinais_humidade ?? body.sinaisHumidade,
      observacoes: body.observacoes,
    };

    // required conforme teu schema SQL (NOT NULL)
    const required = [
      'nome',
      'email',
      'localizacao',
      'tipo_imovel',
      'exposicao_solar',
      'area',
      'tipo_pavimento',
      'possui_planta',
    ];

    const missing = required.filter((k) => !isPresent(normalized[k]));
    if (missing.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios: ${missing.join(', ')}`,
      });
    }

    let plantaUrl = null;
    let plantaPath = null;

    if (req.file) {
      plantaPath = req.file.filename;
      // API_URL opcional, cai pro domínio atual se não tiver
      const baseUrl =
        process.env.API_URL ||
        `${req.protocol}://${req.get('host')}`;
      plantaUrl = `${baseUrl}/uploads/${plantaPath}`;
    }

    // INSERT alinhado com schema (snake_case)
    const result = await client.query(
      `INSERT INTO quote_requests (
        nome, email, telemovel, localizacao, tipo_imovel, ultimo_piso,
        exposicao_solar, nivel_isolamento, zona_fria, sinais_humidade,
        area, tipo_pavimento, possui_planta, observacoes, planta_url, planta_path,
        tipo_obra, piso_localizacao, zona_humida, vidros_duplos
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20
      )
      RETURNING *`,
      [
        normalized.nome,
        normalized.email,
        normalized.telemovel ?? null,
        normalized.localizacao,
        normalized.tipo_imovel,
        normalized.ultimo_piso ?? null,

        normalized.exposicao_solar,
        normalized.nivel_isolamento ?? null,
        normalized.zona_fria ?? null,
        normalized.sinais_humidade ?? null,

        normalized.area,
        normalized.tipo_pavimento,
        normalized.possui_planta,
        normalized.observacoes ?? null,
        plantaUrl,
        plantaPath,

        'Não especificado',
        normalized.ultimo_piso ?? null,
        normalized.sinais_humidade ?? null,
        'Não especificado',
      ]
    );

    await client.query('COMMIT');

    const quote = result.rows[0];

    // email não bloqueia resposta
    sendQuoteNotification(quote).catch((err) => {
      console.error('❌ Erro ao enviar email:', err);
    });

    return res.json({
      success: true,
      message: 'Pedido de orçamento recebido com sucesso!',
      data: {
        id: quote.id,
        nome: quote.nome,
        email: quote.email,
      },
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {}

    console.error('Erro ao submeter orçamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido',
    });
  } finally {
    client.release();
  }
});

export default router;
