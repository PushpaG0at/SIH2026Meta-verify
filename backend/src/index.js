import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or localhost origins
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev mode
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-Role', 'Accept', 'Origin', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'METRA-VERIFY Legal Metrology Engine',
    timestamp: new Date().toISOString(),
    trustChain: 'ACTIVE',
    version: '1.0.0-SIH2026'
  });
});

// Mount API routes (supports both /api and /api/v1)
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚖️  METRA-VERIFY Legal Metrology Platform API running`);
  console.log(`🌐 Port: http://localhost:${PORT}`);
  console.log(`🛡️  Digital Trust Chain: Active (SHA-256 Enabled)`);
  console.log(`====================================================`);
});

export default app;
