import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';

export interface MysterySession {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      mysterySession?: MysterySession;
    }
  }
}

export const SESSION_COOKIE_NAME = 'mystery_session_id';

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  let sessionId = req.cookies?.[SESSION_COOKIE_NAME];

  // Also support X-Session-ID header for API clients / tests
  const headerId = req.headers['x-session-id'];
  if (!sessionId && typeof headerId === 'string' && headerId.trim()) {
    sessionId = headerId.trim();
  }

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });
  }

  // Always mirror session in response header for client persistence
  res.setHeader('X-Session-ID', sessionId);
  req.mysterySession = { id: sessionId };
  next();
}
