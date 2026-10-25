import { Router } from 'express';
import mongoose from 'mongoose';
import { isNeonConfigured } from '../config/neonDatabase.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  let dbStatus = 'disconnected';
  if (isNeonConfigured()) {
    dbStatus = 'connected (Neon Postgres)';
  } else if (mongoose.connection.readyState === 1) {
    dbStatus = 'connected (MongoDB)';
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-mystery-room-api',
    database: dbStatus,
  });
});
