import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    await connectDatabase();
    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`[API] AI Mystery Room server listening on port ${env.PORT} (${env.NODE_ENV})`);
      console.log(`[API] Health check available at: http://localhost:${env.PORT}/api/v1/health`);
    });

    const shutdown = async () => {
      console.log('[API] Gracefully shutting down...');
      server.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[API] Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
