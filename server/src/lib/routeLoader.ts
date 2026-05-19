import { Express, Router, Request, Response } from 'express';

/**
 * Centralized route loader - aggregates all routes in one place
 * Keeps route definitions manageable and easy to maintain
 */
export const loadRoutes = (app: Express) => {
  const apiRouter = Router();

  // Health check endpoint (public, no auth required)
  apiRouter.get('/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'GitHub README Generator API is running 🚀',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    });
  });

  // Status endpoint (for monitoring)
  apiRouter.get('/status', (req: Request, res: Response) => {
    res.json({
      success: true,
      status: 'operational',
      timestamp: new Date().toISOString(),
      checks: {
        server: 'ok',
        supabase: process.env.SUPABASE_URL ? 'configured' : 'not-configured',
      },
    });
  });

  // Information endpoint
  apiRouter.get('/info', (req: Request, res: Response) => {
    res.json({
      success: true,
      name: 'GitHub Profile README Generator API',
      version: '1.0.0',
      description: 'Community-driven platform for creating customizable GitHub profile READMEs',
      environment: process.env.NODE_ENV || 'development',
      apiVersion: 'v1',
    });
  });

  // Mount health check routes
  app.use('/api', apiRouter);

  // Routes are loaded in index.ts:
  // - /api/readmes
  // - /api/community
  // - /api/users
};

/**
 * Dynamic route loader for future use
 * Enables auto-discovery of route files from directory
 */
export const loadRoutesFromDirectory = async (app: Express, dirname: string) => {
  try {
    console.log('[Routes] Manual route loading via explicit imports in index.ts');
  } catch (error) {
    console.error('[Routes] Failed to load routes:', error);
  }
};
