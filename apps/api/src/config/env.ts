import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root if available
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  API_BASE_URL: z.string().default('http://localhost:4000/api/v1'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/ai_mystery_room'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  SESSION_SECRET: z.string().default('dev_session_secret_ai_mystery_room'),
  COOKIE_SECURE: z.string().transform((v) => v === 'true').default('false'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CASE_GENERATION_TIMEOUT_MS: z.coerce.number().default(90000),
  MAX_CASES_PER_HOUR: z.coerce.number().default(10),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
