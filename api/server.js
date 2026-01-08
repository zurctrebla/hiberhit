import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import quoteRoutes from './routes/quotes.js';
import adminRoutes from './routes/admin.js';

// Carregar .env do projeto (/root/hiberhit/.env) de forma robusta,
// independente do CWD que o PM2 usar.
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const app = express();
const PORT = Number(process.env.API_PORT || process.env.PORT || 3001);

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limiting
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir ficheiros estáticos (uploads) - caminho absoluto para não depender do CWD
const uploadsDir = path.resolve(process.cwd(), 'uploads'); // /root/hiberhit/api/uploads (se CWD=api)
app.use('/uploads', express.static(uploadsDir));

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
    error: err.message || 'Erro interno do servidor'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando em http://0.0.0.0:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
