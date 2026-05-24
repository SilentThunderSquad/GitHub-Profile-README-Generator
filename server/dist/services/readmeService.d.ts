import { README, Block } from '../types';
/**
 * Create a new README
 */
export declare const createReadme: (userId: string, title: string, data?: Partial<README>) => Promise<README>;
/**
 * Get README by ID (with access control)
 */
export declare const getReadmeById: (readmeId: string, userId?: string) => Promise<README>;
/**
 * Update README
 */
export declare const updateReadme: (readmeId: string, userId: string, updates: Partial<README>) => Promise<README>;
/**
 * Delete README
 */
export declare const deleteReadme: (readmeId: string, userId: string) => Promise<void>;
/**
 * Get user's READMEs
 */
export declare const getUserReadmes: (userId: string, limit?: number, offset?: number) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Get user's public READMEs (for public profile)
 */
export declare const getUserPublicReadmes: (userId: string, limit?: number, offset?: number) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Publish README
 */
export declare const publishReadme: (readmeId: string, userId: string) => Promise<README>;
/**
 * Autosave README
 */
export declare const autosaveReadme: (readmeId: string, userId: string, blocks: Block[]) => Promise<README>;
/**
 * Change README visibility
 */
export declare const changeReadmeVisibility: (readmeId: string, userId: string, visibility: "private" | "public" | "unlisted") => Promise<README>;
/**
 * Add tags to README
 */
export declare const addReadmeTags: (readmeId: string, userId: string, tagSlugs: string[]) => Promise<void>;
/**
 * Get README with full user details for public view
 */
export declare const getPublicReadmeWithAuthor: (readmeId: string) => Promise<any>;
//# sourceMappingURL=readmeService.d.ts.map