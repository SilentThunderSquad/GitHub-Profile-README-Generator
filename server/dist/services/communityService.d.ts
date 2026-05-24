import { SearchFilters } from '../types';
/**
 * Get trending READMEs based on clones, likes, and recency
 */
export declare const getTrendingReadmes: (limit?: number, offset?: number, filters?: Partial<SearchFilters>) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Get featured/community-pick READMEs
 */
export declare const getFeaturedReadmes: (limit?: number, offset?: number) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Get recently published READMEs
 */
export declare const getRecentReadmes: (limit?: number, offset?: number) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Search READMEs by query and filters
 */
export declare const searchReadmes: (filters: SearchFilters, limit?: number, offset?: number) => Promise<{
    readmes: any[];
    total: number;
}>;
/**
 * Get all available tags with usage counts
 */
export declare const getAllTags: (limit?: number) => Promise<{
    usageCount: number;
    id: any;
    name: any;
    slug: any;
    created_at: any;
}[]>;
/**
 * Get template categories
 */
export declare const getTemplateCategories: () => Promise<any[]>;
/**
 * Get templates by category
 */
export declare const getTemplatesByCategory: (categorySlug: string, limit?: number, offset?: number) => Promise<{
    templates: any[];
    total: number;
}>;
/**
 * Get trending templates
 */
export declare const getTrendingTemplates: (limit?: number, offset?: number) => Promise<{
    templates: any[];
    total: number;
}>;
/**
 * Get featured templates
 */
export declare const getFeaturedTemplates: (limit?: number, offset?: number) => Promise<{
    templates: any[];
    total: number;
}>;
/**
 * Increment view count for a README
 */
export declare const incrementViewCount: (readmeId: string) => Promise<void>;
//# sourceMappingURL=communityService.d.ts.map