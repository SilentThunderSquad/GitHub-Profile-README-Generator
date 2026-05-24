import { Request, Response, NextFunction } from 'express';
import { AuthContext, JWTPayload } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthContext;
            token?: string;
        }
    }
}
/**
 * Verify JWT token with Supabase
 */
export declare const verifyToken: (token: string) => Promise<JWTPayload>;
/**
 * Middleware: Authenticate and extract user from token
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware: Verify user is authenticated (throw if not)
 */
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware: Verify user has specific role
 */
export declare const requireRole: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware: Optional authentication (doesn't fail if not authenticated)
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map