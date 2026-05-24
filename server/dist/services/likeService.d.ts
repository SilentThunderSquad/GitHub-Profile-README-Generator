/**
 * Like a README
 */
export declare const likeReadme: (readmeId: string, userId: string) => Promise<{
    liked: boolean;
    likeCount: any;
}>;
/**
 * Unlike a README
 */
export declare const unlikeReadme: (readmeId: string, userId: string) => Promise<{
    liked: boolean;
    likeCount: any;
}>;
/**
 * Check if user liked a README
 */
export declare const hasUserLikedReadme: (readmeId: string, userId: string) => Promise<boolean>;
/**
 * Get like count for a README
 */
export declare const getLikeCount: (readmeId: string) => Promise<number>;
/**
 * Get recent likers of a README
 */
export declare const getRecentLikers: (readmeId: string, limit?: number) => Promise<{
    created_at: any;
    user_id: any;
    user_profiles: {
        display_name: any;
        avatar_url: any;
        username_slug: any;
    }[];
}[]>;
//# sourceMappingURL=likeService.d.ts.map