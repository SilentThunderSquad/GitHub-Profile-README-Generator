import { supabase } from '../config/supabase';
import { calculateTrendingScore, getDaysSince } from '../utils/helpers';
/**
 * Get trending READMEs based on clones, likes, and recency
 */
export const getTrendingReadmes = async (limit = 20, offset = 0, filters) => {
    let query = supabase
        .from('readmes')
        .select(`
      *,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug,
        is_verified
      )
    `, { count: 'exact' })
        .eq('is_public', true)
        .eq('is_published', true)
        .neq('visibility', 'unlisted');
    if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
    }
    const { data, error, count } = await query
        .order('clone_count', { ascending: false })
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    // Calculate trending scores for sorting
    const scored = (data || []).map((readme) => ({
        ...readme,
        trendingScore: calculateTrendingScore(readme.clone_count || 0, readme.like_count || 0, getDaysSince(readme.created_at)),
    }));
    scored.sort((a, b) => b.trendingScore - a.trendingScore);
    return { readmes: scored, total: count || 0 };
};
/**
 * Get featured/community-pick READMEs
 */
export const getFeaturedReadmes = async (limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('readmes')
        .select(`
      *,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug,
        is_verified
      )
    `, { count: 'exact' })
        .eq('is_public', true)
        .eq('community_pick', true)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { readmes: data || [], total: count || 0 };
};
/**
 * Get recently published READMEs
 */
export const getRecentReadmes = async (limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('readmes')
        .select(`
      *,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug,
        is_verified
      )
    `, { count: 'exact' })
        .eq('is_public', true)
        .eq('is_published', true)
        .neq('visibility', 'unlisted')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { readmes: data || [], total: count || 0 };
};
/**
 * Search READMEs by query and filters
 */
export const searchReadmes = async (filters, limit = 20, offset = 0) => {
    let query = supabase
        .from('readmes')
        .select(`
      *,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug,
        is_verified
      )
    `, { count: 'exact' })
        .eq('is_public', true)
        .eq('is_published', true);
    // Search by query in title and description
    if (filters.query) {
        const searchTerm = `%${filters.query}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
    }
    // Filter by visibility
    if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
    }
    else {
        query = query.neq('visibility', 'unlisted');
    }
    // Sort by criteria
    switch (filters.sortBy || 'trending') {
        case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        case 'most-liked':
            query = query.order('like_count', { ascending: false });
            break;
        case 'most-cloned':
            query = query.order('clone_count', { ascending: false });
            break;
        case 'popular':
            query = query.order('view_count', { ascending: false });
            break;
        case 'trending':
        default:
            query = query.order('clone_count', { ascending: false }).order('like_count', { ascending: false });
    }
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { readmes: data || [], total: count || 0 };
};
/**
 * Get all available tags with usage counts
 */
export const getAllTags = async (limit = 100) => {
    const { data, error } = await supabase
        .from('tags')
        .select('id, name, slug, created_at')
        .order('name')
        .limit(limit);
    if (error)
        throw error;
    // Get usage count for each tag
    if (data) {
        const tagsWithCount = await Promise.all(data.map(async (tag) => {
            const { count } = await supabase
                .from('readme_tags')
                .select('id', { count: 'exact', head: true })
                .eq('tag_id', tag.id);
            return { ...tag, usageCount: count || 0 };
        }));
        return tagsWithCount;
    }
    return [];
};
/**
 * Get template categories
 */
export const getTemplateCategories = async () => {
    const { data, error } = await supabase
        .from('template_categories')
        .select('*')
        .order('name');
    if (error)
        throw error;
    return data || [];
};
/**
 * Get templates by category
 */
export const getTemplatesByCategory = async (categorySlug, limit = 20, offset = 0) => {
    const { data: category } = await supabase
        .from('template_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
    if (!category) {
        throw new Error('Category not found');
    }
    const { data, error, count } = await supabase
        .from('templates')
        .select(`
      *,
      user_profiles:created_by(
        display_name,
        avatar_url,
        username_slug
      )
    `, { count: 'exact' })
        .eq('category_id', category.id)
        .eq('is_featured', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { templates: data || [], total: count || 0 };
};
/**
 * Get trending templates
 */
export const getTrendingTemplates = async (limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('templates')
        .select(`
      *,
      user_profiles:created_by(
        display_name,
        avatar_url,
        username_slug
      )
    `, { count: 'exact' })
        .order('clone_count', { ascending: false })
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { templates: data || [], total: count || 0 };
};
/**
 * Get featured templates
 */
export const getFeaturedTemplates = async (limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('templates')
        .select(`
      *,
      user_profiles:created_by(
        display_name,
        avatar_url,
        username_slug
      )
    `, { count: 'exact' })
        .eq('is_featured', true)
        .order('featured_rank')
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { templates: data || [], total: count || 0 };
};
/**
 * Increment view count for a README
 */
export const incrementViewCount = async (readmeId) => {
    const { data: readme } = await supabase
        .from('readmes')
        .select('view_count')
        .eq('id', readmeId)
        .single();
    if (readme) {
        await supabase
            .from('readmes')
            .update({ view_count: (readme.view_count || 0) + 1 })
            .eq('id', readmeId);
    }
};
//# sourceMappingURL=communityService.js.map