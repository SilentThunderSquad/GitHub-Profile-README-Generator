import { Request, Response } from 'express';
/**
 * GitHub OAuth callback - handles auth code from GitHub
 * Exchanges code for session and creates/updates user profile
 */
export declare const githubOAuthCallback: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Refresh token - get new access token using refresh token
 */
export declare const refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Logout - invalidate session
 */
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get current authenticated user
 */
export declare const getCurrentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Verify authentication token validity
 */
export declare const verifyToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=authController.d.ts.map