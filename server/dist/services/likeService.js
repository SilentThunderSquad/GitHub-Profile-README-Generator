import { supabase } from '../config/supabase';
import { NotFoundError, ConflictError } from '../utils/errors';
/**
 * Like a README
 */
export const likeReadme = async (readmeId, userId) => {
    // Check if README exists and is public/accessible
    const { data: readme, error: readmeError } = await supabase
        .from('readmes')
        .select('id, is_public, user_id, like_count')
        .eq('id', readmeId)
        .single();
    if (readmeError || !readme) {
        throw new NotFoundError('README');
    }
    // User can't like their own README
    if (readme.user_id === userId) {
        throw new Error('Cannot like your own README');
    }
    // Check if already liked (UNIQUE constraint will also catch this)
    const { data: existingLike } = await supabase
        .from('readme_likes')
        .select('id')
        .eq('readme_id', readmeId)
        .eq('user_id', userId)
        .single();
    if (existingLike) {
        throw new ConflictError('You already liked this README');
    }
    // Add like
    const { data: like, error: likeError } = await supabase
        .from('readme_likes')
        .insert([{ readme_id: readmeId, user_id: userId }])
        .select()
        .single();
    if (likeError)
        throw likeError;
    // Increment like count atomically
    const { data: updated, error: updateError } = await supabase
        .from('readmes')
        .update({ like_count: (readme.like_count || 0) + 1 })
        .eq('id', readmeId)
        .select('like_count')
        .single();
    if (updateError)
        throw updateError;
    return { liked: true, likeCount: updated.like_count };
};
/**
 * Unlike a README
 */
export const unlikeReadme = async (readmeId, userId) => {
    // Get current like count
    const { data: readme, error: readmeError } = await supabase
        .from('readmes')
        .select('id, like_count')
        .eq('id', readmeId)
        .single();
    if (readmeError || !readme) {
        throw new NotFoundError('README');
    }
    // Remove like
    const { error: deleteError } = await supabase
        .from('readme_likes')
        .delete()
        .eq('readme_id', readmeId)
        .eq('user_id', userId);
    if (deleteError)
        throw deleteError;
    // Decrement like count atomically
    const newCount = Math.max((readme.like_count || 1) - 1, 0);
    const { data: updated, error: updateError } = await supabase
        .from('readmes')
        .update({ like_count: newCount })
        .eq('id', readmeId)
        .select('like_count')
        .single();
    if (updateError)
        throw updateError;
    return { liked: false, likeCount: updated.like_count };
};
/**
 * Check if user liked a README
 */
export const hasUserLikedReadme = async (readmeId, userId) => {
    if (!userId)
        return false;
    const { data } = await supabase
        .from('readme_likes')
        .select('id')
        .eq('readme_id', readmeId)
        .eq('user_id', userId)
        .single();
    return !!data;
};
/**
 * Get like count for a README
 */
export const getLikeCount = async (readmeId) => {
    const { data, error } = await supabase
        .from('readmes')
        .select('like_count')
        .eq('id', readmeId)
        .single();
    if (error)
        return 0;
    return data?.like_count || 0;
};
/**
 * Get recent likers of a README
 */
export const getRecentLikers = async (readmeId, limit = 10) => {
    const { data, error } = await supabase
        .from('readme_likes')
        .select(`
      created_at,
      user_id,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug
      )
    `)
        .eq('readme_id', readmeId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error)
        throw error;
    return data || [];
};
//# sourceMappingURL=likeService.js.map