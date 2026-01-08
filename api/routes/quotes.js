import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { sendQuoteNotification } from '../services/email.js';

const router = express.Router();

// Configurar multer para upload de ficheiros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null, 'uploads/');
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    //const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
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
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Tipo de ficheiro não permitido'));
  }
});

// Submeter pedido de orçamento
router.post('/submit', upload.single('planta'), async (req, res) => {
  const client = await pool.connect();
 
  try {
    await client.query('BEGIN');

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
    } = req.body;

    const requiredFields = ['nome', 'email','telemovel', 'localizacao', 'tipoImovel', 'exposicaoSolar', 'area', 'tipoPavimento', 'possuiPlanta'];

for (const f of requiredFields) {
  const v = req.body?.[f];
  const ok = typeof v === 'string' ? v.trim() !== '' : v !== undefined && v !== null;
  if (!ok) {
    await client.query('ROLLBACK');
    return res.status(400).json({ success: false, error: `Campo obrigatório: ${f}` });
  }
}

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => v === undefined || v === null || v === '')
      .map(([k]) => k);

    if (missing.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios: ${missing.join(', ')}`
      });
    }

    if (!nome || !email || !localizacao || !tipoImovel) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, email, localizacao, tipoImovel'
      });
    }

    let plantaUrl = null;
    let plantaPath = null;

    if (req.file) {
      plantaPath = req.file.filename;
      plantaUrl = `${process.env.API_URL || 'http://localhost:3001'}/uploads/${plantaPath}`;
    }

    const result = await client.query(
      `INSERT INTO quote_requests (
        nome, email, telemovel, localizacao, tipo_imovel, ultimo_piso,
        exposicao_solar, nivel_isolamento, zona_fria, sinais_humidade,
        area, tipo_pavimento, possui_planta, observacoes, planta_url, planta_path,
        tipo_obra, piso_localizacao, zona_humida, vidros_duplos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        nome, email, telemovel, localizacao, tipoImovel, ultimoPiso,
        exposicaoSolar, nivelIsolamento, zonaFria, sinaisHumidade,
        area, tipoPavimento, possuiPlanta, observacoes, plantaUrl, plantaPath,
        'Não especificado', ultimoPiso, sinaisHumidade, 'Não especificado'
      ]
    );

    await client.query('COMMIT');

    const quote = result.rows[0];

    // Enviar notificação por email (não bloquear resposta)
    sendQuoteNotification(quote).catch(err => 
      console.error('Erro ao enviar email:', err)
    );

    res.json({
      success: true,
      message: 'Pedido de orçamento recebido com sucesso!',
      data: {
        id: quote.id,
        nome: quote.nome,
        email: quote.email
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao submeter orçamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar pedido'
    });
  } finally {
    client.release();
  }
});

export default router;
