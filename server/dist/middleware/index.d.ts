import { Express } from 'express';
/**
 * Configure all middleware in production-ready order
 * Middleware order is critical for security and performance
 */
export declare const configureMiddleware: (app: Express, frontendUrl: string) => void;
declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}
//# sourceMappingURL=index.d.ts.map