import { supabase } from '../config/supabase';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { generateUniqueSlug, slugify } from '../utils/helpers';

/**
 * Clone a README
 */
export const cloneReadme = async (
  originalReadmeId: string,
  userId: string,
  cloneTitle?: string,
  cloneDescription?: string
) => {
  // Get original README
  const { data: original, error: originalError } = await supabase
    .from('readmes')
    .select('*')
    .eq('id', originalReadmeId)
    .single();

  if (originalError || !original) {
    throw new NotFoundError('Original README');
  }

  // Check if cloning is allowed
  if (!original.allow_cloning) {
    throw new AuthorizationError('This README does not allow cloning');
  }

  // Check if original is public or user is owner
  if (!original.is_public && original.user_id !== userId) {
    throw new AuthorizationError('Cannot clone private README');
  }

  // Get user's existing README slugs to ensure uniqueness
  const { data: userReadmes } = await supabase
    .from('readmes')
    .select('slug')
    .eq('user_id', userId);

  const existingSlugs = (userReadmes || []).map((r) => r.slug);
  const baseSlug = slugify(cloneTitle || `${original.title}-clone`);
  const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

  // Create cloned README
  const { data: cloned, error: cloneError } = await supabase
    .from('readmes')
    .insert([
      {
        user_id: userId,
        title: cloneTitle || `${original.title} (Clone)`,
        slug: uniqueSlug,
        description: cloneDescription || original.description,
        blocks: original.blocks,
        is_public: false,
        visibility: 'private',
        forked_from_readme_id: originalReadmeId,
        tags: original.tags,
        metadata: original.metadata,
      },
    ])
    .select()
    .single();

  if (cloneError) throw cloneError;

  // Record clone in readme_clones table
  const { error: cloneRecordError } = await supabase
    .from('readme_clones')
    .insert([
      {
        original_readme_id: originalReadmeId,
        cloned_readme_id: cloned.id,
        cloned_by_user_id: userId,
      },
    ]);

  if (cloneRecordError) throw cloneRecordError;

  // Increment original README clone count atomically
  const { error: updateError } = await supabase
    .from('readmes')
    .update({ clone_count: (original.clone_count || 0) + 1 })
    .eq('id', originalReadmeId);

  if (updateError) throw updateError;

  return cloned;
};

/**
 * Get clone count and details for a README
 */
export const getReadmeCloneDetails = async (readmeId: string) => {
  // Get clone count
  const { data: readme, error: readmeError } = await supabase
    .from('readmes')
    .select('clone_count')
    .eq('id', readmeId)
    .single();

  if (readmeError || !readme) {
    throw new NotFoundError('README');
  }

  // Get recent clones with user info
  const { data: recentClones, error: clonesError } = await supabase
    .from('readme_clones')
    .select(`
      id,
      cloned_by_user_id,
      created_at,
      user_profiles:cloned_by_user_id(
        display_name,
        avatar_url,
        username_slug
      )
    `)
    .eq('original_readme_id', readmeId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (clonesError) throw clonesError;

  return {
    cloneCount: readme.clone_count || 0,
    recentClones: recentClones || [],
  };
};

/**
 * Get README clones tree (all clones of clones)
 */
export const getCloneTree = async (readmeId: string) => {
  const { data, error } = await supabase
    .from('readmes')
    .select('id, title, slug, forked_from_readme_id, created_at')
    .eq('forked_from_readme_id', readmeId);

  if (error) throw error;
  return data || [];
};

/**
 * Check if a README is a clone of another
 */
export const isCloneOf = async (readmeId: string, originalId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('readme_clones')
    .select('id')
    .eq('original_readme_id', originalId)
    .eq('cloned_readme_id', readmeId)
    .single();

  return !!data;
};

/**
 * Get user's cloned READMEs
 */
export const getUserClonedReadmes = async (userId: string, limit = 20, offset = 0) => {
  const { data, error, count } = await supabase
    .from('readme_clones')
    .select(`
      cloned_readme_id,
      created_at,
      original_readme:original_readme_id(
        id,
        title,
        slug,
        user_id,
        user_profiles:user_id(
          display_name,
          avatar_url,
          username_slug
        )
      )
    `, { count: 'exact' })
    .eq('cloned_by_user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { clones: data || [], total: count || 0 };
};
