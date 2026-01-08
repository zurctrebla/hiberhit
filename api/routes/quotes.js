import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { sendQuoteNotification } from '../services/email.js';

const router = express.Router();

/**
 * Upload dir (pode vir do .env)
 * - Se UPLOAD_DIR vier relativo (ex: ./uploads ou uploads), resolve para caminho absoluto
 * - Garante que a pasta exista
 */
function resolveUploadDir() {
  const raw = process.env.UPLOAD_DIR || 'uploads';
  const dir = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const uploadDir = resolveUploadDir();

// Configurar multer para upload de ficheiros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
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
  }
});

const maybeUpload = (req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('multipart/form-data')) {
    return upload.single('planta')(req, res, next);
  }
  return next();
};


/**
 * Normaliza body para suportar:
 * - multipart/form-data (multer)
 * - application/json
 *
 * No multipart, tudo vem como string. Aqui a gente só normaliza boolean/number básicos.
 */
function normalizeBody(body) {
  const out = { ...body };

  // boolean mais comum
  if (typeof out.possuiPlanta === 'string') {
    const v = out.possuiPlanta.toLowerCase().trim();
    out.possuiPlanta = v === 'true' || v === '1' || v === 'sim' || v === 'yes';
  }

  // área como número (se vier string)
  if (typeof out.area === 'string' && out.area.trim() !== '') {
    const n = Number(out.area.replace(',', '.'));
    out.area = Number.isFinite(n) ? n : out.area;
  }

  return out;
}

function isMissing(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  return false;
}

// Submeter pedido de orçamento
// router.post('/submit', upload.single('planta'), async (req, res) => {
router.post('/submit', maybeUpload, async (req, res) => {

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const body = normalizeBody(req.body || {});

    const {
      nome,
      email,
      telemovel,
      localizacao,
      tipoImovel,
      ultimoPiso,
      exposicaoSolar,
      nivelIsolamento,
      zonaFria,
      sinaisHumidade,
      area,
      tipoPavimento,
      possuiPlanta,
      observacoes
    } = body;

    // Campos obrigatórios (do DB e do teu fluxo)
    const requiredFields = [
      'nome',
      'email',
      'telemovel',
      'localizacao',
      'tipoImovel',
      'exposicaoSolar',
      'area',
      'tipoPavimento',
      'possuiPlanta'
    ];

    const missing = requiredFields.filter((f) => isMissing(body[f]));

    if (missing.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios: ${missing.join(', ')}`
      });
    }

    let plantaUrl = null;
    let plantaPath = null;

    if (req.file) {
      plantaPath = req.file.filename;

      // URL base correta (preferir domínio público se tiver no env)
      const baseUrl =
        process.env.API_PUBLIC_URL ||
        process.env.API_URL ||
        `https://landing.iberhit.com`;

      plantaUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${plantaPath}`;
    }

    // OBS: os 4 últimos campos que tu tava repetindo (ultimoPiso/sinaisHumidade)
    // estavam claramente “placeholder”. Mantive a ideia, mas sem duplicar campos errados.
    // Ajusta esses defaults conforme teu front/DB.
    const result = await client.query(
      `INSERT INTO quote_requests (
        nome, email, telemovel, localizacao, tipo_imovel, ultimo_piso,
        exposicao_solar, nivel_isolamento, zona_fria, sinais_humidade,
        area, tipo_pavimento, possui_planta, observacoes, planta_url, planta_path,
        tipo_obra, piso_localizacao, zona_humida, vidros_duplos
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20
      )
      RETURNING *`,
      [
        nome,
        email,
        telemovel,
        localizacao,
        tipoImovel,
        ultimoPiso ?? null,

        exposicaoSolar,
        nivelIsolamento ?? null,
        zonaFria ?? null,
        sinaisHumidade ?? null,

        area,
        tipoPavimento,
        possuiPlanta,
        observacoes ?? null,
        plantaUrl,
        plantaPath,

        'Não especificado',
        ultimoPiso ?? null,
        'Não especificado',
        'Não especificado'
      ]
    );

    await client.query('COMMIT');

    const quote = result.rows[0];

    // Email NÃO deve quebrar o request nem impedir gravar no DB
    sendQuoteNotification(quote).catch((err) =>
      console.error('❌ Erro ao enviar email:', err)
    );

    return res.json({
      success: true,
      message: 'Pedido de orçamento recebido com sucesso!',
      data: {
        id: quote.id,
        nome: quote.nome,
        email: quote.email
      }
    });
  } catch (error) {
    // se der erro antes do COMMIT, rollback. se já comitou, rollback vai falhar; então try/catch aqui.
    try {
      await client.query('ROLLBACK');
    } catch (_) {}

    console.error('Erro ao submeter orçamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido'
    });
  } finally {
    client.release();
  }
});

export default router;
