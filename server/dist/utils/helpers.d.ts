/**
 * Generate a URL-safe slug from a string
 */
export declare const slugify: (text: string) => string;
/**
 * Generate unique slug by appending numbers
 */
export declare const generateUniqueSlug: (baseSlug: string, existingSlugs: string[]) => string;
/**
 * Validate slug format
 */
export declare const isValidSlug: (slug: string) => boolean;
/**
 * Generate username slug from email or name
 */
export declare const generateUsernameSlug: (emailOrName: string) => string;
/**
 * Calculate trending score for content
 * @param cloneCount - Number of clones
 * @param likeCount - Number of likes
 * @param daysSincePublish - Days since published
 * @returns Score between 0-100
 */
export declare const calculateTrendingScore: (cloneCount: number, likeCount: number, daysSincePublish: number) => number;
/**
 * Get days since a date
 */
export declare const getDaysSince: (date: Date | string) => number;
/**
 * Sanitize object property names (remove dangerous fields)
 */
export declare const sanitizeObject: (obj: any, dangerousFields?: string[]) => any;
/**
 * Truncate text to specified length
 */
export declare const truncate: (text: string, length: number, suffix?: string) => string;
/**
 * Extract hashtags from text
 */
export declare const extractHashtags: (text: string) => string[];
/**
 * Format bytes to human readable format
 */
export declare const formatBytes: (bytes: number, decimals?: number) => string;
//# sourceMappingURL=helpers.d.ts.map