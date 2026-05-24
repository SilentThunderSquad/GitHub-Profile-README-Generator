/**
 * Generate a URL-safe slug from a string
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]/g, '-')
        .replace(/-+/g, '-');
};
/**
 * Generate unique slug by appending numbers
 */
export const generateUniqueSlug = (baseSlug, existingSlugs) => {
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }
    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    while (existingSlugs.includes(newSlug)) {
        counter++;
        newSlug = `${baseSlug}-${counter}`;
    }
    return newSlug;
};
/**
 * Validate slug format
 */
export const isValidSlug = (slug) => {
    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
};
/**
 * Generate username slug from email or name
 */
export const generateUsernameSlug = (emailOrName) => {
    const base = emailOrName.split('@')[0];
    return slugify(base);
};
/**
 * Calculate trending score for content
 * @param cloneCount - Number of clones
 * @param likeCount - Number of likes
 * @param daysSincePublish - Days since published
 * @returns Score between 0-100
 */
export const calculateTrendingScore = (cloneCount, likeCount, daysSincePublish) => {
    // Weights: clones 50%, likes 30%, recency 20%
    const cloneScore = Math.min((cloneCount / 1000) * 50, 50);
    const likeScore = Math.min((likeCount / 500) * 30, 30);
    // Recency decays over 200 days
    const maxRecencyScore = 20;
    const recencyScore = Math.max(maxRecencyScore - (daysSincePublish / 10), 0);
    return cloneScore + likeScore + recencyScore;
};
/**
 * Get days since a date
 */
export const getDaysSince = (date) => {
    const past = new Date(date).getTime();
    const now = new Date().getTime();
    return Math.floor((now - past) / (1000 * 60 * 60 * 24));
};
/**
 * Sanitize object property names (remove dangerous fields)
 */
export const sanitizeObject = (obj, dangerousFields = []) => {
    const dangerous = ['password', 'secret', 'token', 'apiKey', ...dangerousFields];
    const sanitized = { ...obj };
    dangerous.forEach((field) => {
        delete sanitized[field];
    });
    return sanitized;
};
/**
 * Truncate text to specified length
 */
export const truncate = (text, length, suffix = '...') => {
    if (text.length <= length)
        return text;
    return text.substring(0, length - suffix.length) + suffix;
};
/**
 * Extract hashtags from text
 */
export const extractHashtags = (text) => {
    const matches = text.match(/#[\w]+/g) || [];
    return [...new Set(matches.map((tag) => tag.substring(1).toLowerCase()))];
};
/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
//# sourceMappingURL=helpers.js.map