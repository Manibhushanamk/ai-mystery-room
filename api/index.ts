let appInstance: any = null;

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    const { createApp } = await import('../apps/api/src/app.js');
    const { connectDatabase } = await import('../apps/api/src/config/database.js');
    try {
      await connectDatabase();
    } catch (err) {
      console.error('[Vercel Handler] Database connection error:', err);
    }
    appInstance = createApp();
  }

  return appInstance(req, res);
}
