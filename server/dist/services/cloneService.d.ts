/**
 * Clone a README
 */
export declare const cloneReadme: (originalReadmeId: string, userId: string, cloneTitle?: string, cloneDescription?: string) => Promise<any>;
/**
 * Get clone count and details for a README
 */
export declare const getReadmeCloneDetails: (readmeId: string) => Promise<{
    cloneCount: any;
    recentClones: {
        id: any;
        cloned_by_user_id: any;
        created_at: any;
        user_profiles: {
            display_name: any;
            avatar_url: any;
            username_slug: any;
        }[];
    }[];
}>;
/**
 * Get README clones tree (all clones of clones)
 */
export declare const getCloneTree: (readmeId: string) => Promise<{
    id: any;
    title: any;
    slug: any;
    forked_from_readme_id: any;
    created_at: any;
}[]>;
/**
 * Check if a README is a clone of another
 */
export declare const isCloneOf: (readmeId: string, originalId: string) => Promise<boolean>;
/**
 * Get user's cloned READMEs
 */
export declare const getUserClonedReadmes: (userId: string, limit?: number, offset?: number) => Promise<{
    clones: {
        cloned_readme_id: any;
        created_at: any;
        original_readme: {
            id: any;
            title: any;
            slug: any;
            user_id: any;
            user_profiles: {
                display_name: any;
                avatar_url: any;
                username_slug: any;
            }[];
        }[];
    }[];
    total: number;
}>;
//# sourceMappingURL=cloneService.d.ts.map