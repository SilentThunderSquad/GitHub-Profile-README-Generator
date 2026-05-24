import { supabase } from '../config/supabase';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { slugify, generateUniqueSlug } from '../utils/helpers';
import { generateMarkdownFromBlocks } from './markdownService';
/**
 * Create a new README
 */
export const createReadme = async (userId, title, data = {}) => {
    const baseSlug = slugify(data.slug || title);
    // Get user's existing slugs to ensure uniqueness
    const { data: existingReadmes } = await supabase
        .from('readmes')
        .select('slug')
        .eq('user_id', userId);
    const existingSlugs = (existingReadmes || []).map((r) => r.slug);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
    // Generate markdown from blocks
    const markdown = generateMarkdownFromBlocks(data.blocks || []);
    const { data: readme, error } = await supabase
        .from('readmes')
        .insert([
        {
            user_id: userId,
            title,
            slug: uniqueSlug,
            description: data.description || '',
            blocks: data.blocks || [],
            markdown_output: markdown,
            is_public: data.is_public || false,
            visibility: data.visibility || 'private',
            tags: data.tags || [],
            metadata: data.metadata || {},
            allow_cloning: data.allow_cloning !== false,
        },
    ])
        .select()
        .single();
    if (error)
        throw error;
    return readme;
};
/**
 * Get README by ID (with access control)
 */
export const getReadmeById = async (readmeId, userId) => {
    const { data: readme, error } = await supabase
        .from('readmes')
        .select(`
      *,
      user_profiles:user_id(
        display_name,
        avatar_url,
        username_slug,
        is_verified
      )
    `)
        .eq('id', readmeId)
        .single();
    if (error || !readme) {
        throw new NotFoundError('README');
    }
    // Check access
    if (readme.visibility === 'private' && readme.user_id !== userId) {
        throw new AuthorizationError('Cannot access this README');
    }
    return readme;
};
/**
 * Update README
 */
export const updateReadme = async (readmeId, userId, updates) => {
    // Verify ownership
    const { data: readme } = await supabase.from('readmes').select('user_id').eq('id', readmeId).single();
    if (!readme || readme.user_id !== userId) {
        throw new AuthorizationError('Cannot update this README');
    }
    // Generate markdown if blocks changed
    let markdown = updates.markdown_output;
    if (updates.blocks) {
        markdown = generateMarkdownFromBlocks(updates.blocks);
    }
    const { data: updated, error } = await supabase
        .from('readmes')
        .update({
        ...updates,
        markdown_output: markdown,
    })
        .eq('id', readmeId)
        .eq('user_id', userId)
        .select()
        .single();
    if (error)
        throw error;
    return updated;
};
/**
 * Delete README
 */
export const deleteReadme = async (readmeId, userId) => {
    const { error } = await supabase.from('readmes').delete().eq('id', readmeId).eq('user_id', userId);
    if (error)
        throw error;
};
/**
 * Get user's READMEs
 */
export const getUserReadmes = async (userId, limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('readmes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { readmes: data || [], total: count || 0 };
};
/**
 * Get user's public READMEs (for public profile)
 */
export const getUserPublicReadmes = async (userId, limit = 20, offset = 0) => {
    const { data, error, count } = await supabase
        .from('readmes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_public', true)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw error;
    return { readmes: data || [], total: count || 0 };
};
/**
 * Publish README
 */
export const publishReadme = async (readmeId, userId) => {
    const { data: readme } = await supabase.from('readmes').select('user_id').eq('id', readmeId).single();
    if (!readme || readme.user_id !== userId) {
        throw new AuthorizationError('Cannot publish this README');
    }
    const { data: published, error } = await supabase
        .from('readmes')
        .update({
        is_published: true,
        published_at: new Date().toISOString(),
    })
        .eq('id', readmeId)
        .select()
        .single();
    if (error)
        throw error;
    return published;
};
/**
 * Autosave README
 */
export const autosaveReadme = async (readmeId, userId, blocks) => {
    const { data: readme } = await supabase.from('readmes').select('user_id').eq('id', readmeId).single();
    if (!readme || readme.user_id !== userId) {
        throw new AuthorizationError('Cannot autosave this README');
    }
    const markdown = generateMarkdownFromBlocks(blocks);
    const { data: updated, error } = await supabase
        .from('readmes')
        .update({
        blocks,
        markdown_output: markdown,
    })
        .eq('id', readmeId)
        .select()
        .single();
    if (error)
        throw error;
    return updated;
};
/**
 * Change README visibility
 */
export const changeReadmeVisibility = async (readmeId, userId, visibility) => {
    const { data: readme } = await supabase.from('readmes').select('user_id').eq('id', readmeId).single();
    if (!readme || readme.user_id !== userId) {
        throw new AuthorizationError('Cannot change visibility of this README');
    }
    const { data: updated, error } = await supabase
        .from('readmes')
        .update({ visibility, is_public: visibility === 'public' })
        .eq('id', readmeId)
        .select()
        .single();
    if (error)
        throw error;
    return updated;
};
/**
 * Add tags to README
 */
export const addReadmeTags = async (readmeId, userId, tagSlugs) => {
    // Verify ownership
    const { data: readme } = await supabase.from('readmes').select('user_id').eq('id', readmeId).single();
    if (!readme || readme.user_id !== userId) {
        throw new AuthorizationError('Cannot modify this README');
    }
    // Get or create tags
    for (const slug of tagSlugs) {
        // Check if tag exists
        const { data: existingTag } = await supabase.from('tags').select('id').eq('slug', slug).single();
        let tagId = existingTag?.id;
        // Create tag if it doesn't exist
        if (!tagId) {
            const { data: newTag } = await supabase
                .from('tags')
                .insert([{ name: slug.replace(/-/g, ' '), slug }])
                .select('id')
                .single();
            tagId = newTag?.id;
        }
        // Link tag to README
        if (tagId) {
            await supabase.from('readme_tags').insert([{ readme_id: readmeId, tag_id: tagId }]).single();
        }
    }
    // Update tags array in README
    await supabase.from('readmes').update({ tags: tagSlugs }).eq('id', readmeId).single();
};
/**
 * Get README with full user details for public view
 */
export const getPublicReadmeWithAuthor = async (readmeId) => {
    const readme = await getReadmeById(readmeId);
    const { data: author } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', readme.user_id)
        .single();
    return { ...readme, author };
};
//# sourceMappingURL=readmeService.js.map