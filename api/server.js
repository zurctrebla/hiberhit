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
import uploadsRoutes from './routes/uploads.js';

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
// app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/mnt/volume_lon1_01/uploads/public';
app.use('/uploads', express.static(UPLOAD_DIR));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);

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

const server = app
  .listen(PORT, HOST, () => {
    console.log(`🚀 API rodando em http://${HOST}:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  })
  .on('error', (err) => {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  Recebido ${signal}. Encerrando gracefully...`);

  server.close(() => {
    console.log('✅ Servidor HTTP encerrado');
    process.exit(0);
  });

  // Force shutdown após 10 segundos
  setTimeout(() => {
    console.error('❌ Forçando encerramento após timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturar erros não tratados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  // Não encerrar processo, apenas logar
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Encerrar processo em caso de exceção não tratada
  process.exit(1);
});
