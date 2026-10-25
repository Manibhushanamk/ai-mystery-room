import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function isNeonConfigured(): boolean {
  const url = env.DATABASE_URL?.trim();
  return Boolean(url && (url.startsWith('postgres://') || url.startsWith('postgresql://')));
}

export function getNeonPool(): pg.Pool {
  if (!pool) {
    if (!isNeonConfigured()) {
      throw new Error('DATABASE_URL is not configured for Neon Postgres.');
    }
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function initNeonDatabase(): Promise<void> {
  if (!isNeonConfigured()) return;

  const currentPool = getNeonPool();
  console.log('[Neon Postgres] Initializing database schema on Neon...');

  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS mystery_cases (
      id VARCHAR(64) PRIMARY KEY,
      owner_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL DEFAULT 'Generating Investigation...',
      scenario_seed TEXT NOT NULL,
      genre VARCHAR(32) NOT NULL,
      difficulty VARCHAR(32) NOT NULL,
      setting TEXT,
      status VARCHAR(32) NOT NULL DEFAULT 'generating_outline',
      generation JSONB NOT NULL DEFAULT '{}'::jsonb,
      public_case JSONB NOT NULL DEFAULT '{}'::jsonb,
      private_solution JSONB NOT NULL DEFAULT '{}'::jsonb,
      player_state JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_mystery_cases_owner ON mystery_cases(owner_id);
    CREATE INDEX IF NOT EXISTS idx_mystery_cases_status ON mystery_cases(status);
  `);

  console.log('[Neon Postgres] Schema successfully initialized.');
}

export async function closeNeonDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
