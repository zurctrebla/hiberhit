import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import quoteRoutes from './routes/quotes.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env do projeto pai: /root/hiberhit/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

// Middleware de segurança
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// Rate limiting (com Nginx na frente precisa trust proxy)
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parser (JSON e form-urlencoded)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir uploads (caminho relativo ao CWD do PM2 /root/hiberhit/api)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
  });
});

app
  .listen(PORT, HOST, () => {
    console.log(`🚀 API rodando em http://${HOST}:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  })
  .on('error', (err) => {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
  });
