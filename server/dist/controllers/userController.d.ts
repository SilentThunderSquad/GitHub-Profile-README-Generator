import { Request, Response } from 'express';
/**
 * Get public user profile by username slug
 */
export declare const getPublicProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's public READMEs
 */
export declare const getUserPublicReadmes: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's public templates
 */
export declare const getUserPublicTemplates: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user profile for authenticated user
 */
export declare const getCurrentUserProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Update current user profile
 */
export declare const updateCurrentUserProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user settings
 */
export declare const getUserSettings: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Update user settings
 */
export declare const updateUserSettings: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user statistics
 */
export declare const getUserStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get public user statistics (for public profile)
 */
export declare const getPublicUserStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=userController.d.ts.map