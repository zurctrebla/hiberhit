import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadPrivateFile, getPrivateFileUrl, uploadBuffer, deleteFile, getContentType } from '../services/spaces.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Configuração do multer para armazenamento temporário em memória
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
  fileFilter: (req, file, cb) => {
    // Tipos de arquivo permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});

/**
 * POST /api/uploads/document
 * Upload de documento privado (requer autenticação)
 * Usa Digital Ocean Spaces se configurado, caso contrário usa storage local
 */
router.post('/document', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { quoteId, type = 'document' } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: 'quoteId é obrigatório' });
    }

    // Verifica se o Digital Ocean Spaces está configurado
    const useSpaces = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

    if (useSpaces) {
      // Upload para Digital Ocean Spaces
      const timestamp = Date.now();
      const filename = `${quoteId}-${timestamp}${path.extname(req.file.originalname)}`;
      const key = `admin/${type}/${filename}`;

      // Upload do buffer diretamente
      await uploadBuffer(
        req.file.buffer,
        key,
        req.file.mimetype,
        false // privado
      );

      res.json({
        success: true,
        fileKey: key,
        filename: req.file.originalname,
        size: req.file.size,
        storage: 'spaces',
      });

    } else {
      // Fallback para storage local
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const timestamp = Date.now();
      const filename = `${quoteId}-${timestamp}${path.extname(req.file.originalname)}`;
      const filepath = path.join(uploadDir, filename);

      // Cria o diretório se não existir
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Salva o arquivo localmente
      fs.writeFileSync(filepath, req.file.buffer);

      res.json({
        success: true,
        fileKey: filename,
        filename: req.file.originalname,
        size: req.file.size,
        storage: 'local',
      });
    }

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
  }
});

/**
 * GET /api/uploads/document/:fileKey
 * Gera URL temporária para download de documento privado
 * Requer autenticação
 */
router.get('/document/:fileKey(*)', verifyToken, async (req, res) => {
  try {
    const fileKey = req.params.fileKey;

    // Verifica se o Digital Ocean Spaces está configurado
    const useSpaces = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

    if (useSpaces) {
      // Gera URL assinada temporária (válida por 1 hora)
      const downloadUrl = await getPrivateFileUrl(fileKey, 3600);

      res.json({
        success: true,
        downloadUrl,
        expiresIn: 3600,
      });

    } else {
      // Fallback para storage local
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const filepath = path.join(uploadDir, fileKey);

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      // Retorna a URL local (em produção, isso deve ser servido pelo Nginx/Apache)
      const localUrl = `/uploads/${fileKey}`;

      res.json({
        success: true,
        downloadUrl: localUrl,
        expiresIn: null, // URLs locais não expiram
      });
    }

  } catch (error) {
    console.error('Erro ao gerar URL de download:', error);
    res.status(500).json({ error: 'Erro ao gerar URL de download' });
  }
});

/**
 * POST /api/uploads/attachment
 * Upload de anexo para orçamento (PDF, imagens, etc.)
 * Requer autenticação
 */
router.post('/attachment', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { quoteId, description } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: 'quoteId é obrigatório' });
    }

    const useSpaces = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

    if (useSpaces) {
      const timestamp = Date.now();
      const filename = `${quoteId}-${timestamp}${path.extname(req.file.originalname)}`;
      const key = `admin/attachments/${filename}`;

      await uploadBuffer(
        req.file.buffer,
        key,
        req.file.mimetype,
        false
      );

      res.json({
        success: true,
        fileKey: key,
        filename: req.file.originalname,
        description: description || '',
        size: req.file.size,
        storage: 'spaces',
      });

    } else {
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const timestamp = Date.now();
      const filename = `${quoteId}-${timestamp}${path.extname(req.file.originalname)}`;
      const filepath = path.join(uploadDir, filename);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(filepath, req.file.buffer);

      res.json({
        success: true,
        fileKey: filename,
        filename: req.file.originalname,
        description: description || '',
        size: req.file.size,
        storage: 'local',
      });
    }

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do anexo' });
  }
});

/**
 * DELETE /api/uploads/:fileKey
 * Deleta um arquivo
 * Requer autenticação de admin
 */
router.delete('/:fileKey(*)', verifyToken, async (req, res) => {
  try {
    const fileKey = req.params.fileKey;

    const useSpaces = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

    if (useSpaces) {
      await deleteFile(fileKey);
      res.json({ success: true, message: 'Arquivo deletado com sucesso' });
    } else {
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const filepath = path.join(uploadDir, fileKey);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        res.json({ success: true, message: 'Arquivo deletado com sucesso' });
      } else {
        res.status(404).json({ error: 'Arquivo não encontrado' });
      }
    }

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

export default router;
