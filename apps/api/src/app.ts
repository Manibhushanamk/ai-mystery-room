import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import { sessionMiddleware } from './middleware/session.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { casesRouter } from './routes/cases.js';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false, // Allow local dev assets
    }),
  );

  app.use(
    cors({
      origin: [env.WEB_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      exposedHeaders: ['X-Session-ID'],
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser(env.SESSION_SECRET));
  app.use(sessionMiddleware);

  // Mount API V1 base router
  const apiV1Router = express.Router();
  apiV1Router.use('/', healthRouter);
  apiV1Router.use('/cases', casesRouter);

  app.use('/api/v1', apiV1Router);

  // Error handler
  app.use(errorHandler);

  return app;
}
