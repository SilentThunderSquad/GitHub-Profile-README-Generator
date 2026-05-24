import { Request, Response, NextFunction } from 'express';
/**
 * Create a new README
 */
export declare const createReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get README by ID
 */
export declare const getReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Update README
 */
export declare const updateReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Delete README
 */
export declare const deleteReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get user's READMEs
 */
export declare const getUserReadmes: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Clone README
 */
export declare const cloneReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get clone details
 */
export declare const getCloneDetails: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Publish README
 */
export declare const publishReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Autosave README
 */
export declare const autosaveReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get generated markdown
 */
export declare const getMarkdown: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Export README as .md file
 */
export declare const exportReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Like README
 */
export declare const likeReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Unlike README
 */
export declare const unlikeReadme: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Get like details
 */
export declare const getLikeDetails: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Change README visibility
 */
export declare const changeVisibility: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Add tags to README
 */
export declare const addTags: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=readmeController.d.ts.map