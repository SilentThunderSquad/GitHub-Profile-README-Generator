import { supabase } from '@/lib/supabase';

export interface ReadmeData {
  title: string;
  description?: string;
  blocks: any[];
  markdown: string;
  is_public?: boolean;
  visibility?: 'private' | 'public' | 'unlisted';
  tags?: string[];
}

export interface ReadmeSaveResponse {
  id: string;
  title: string;
  markdown: string;
  created_at: string;
  success: boolean;
}

/**
 * Generate markdown from blocks (frontend only)
 * Note: This is handled by the store's getMarkdown() function
 */
export const generateReadme = (): string => {
  return '';
};

/**
 * Save README to Supabase
 */
export const saveReadme = async (
  userId: string,
  title: string,
  markdown: string,
  blocks: any[],
  options?: {
    description?: string;
    is_public?: boolean;
    visibility?: 'private' | 'public' | 'unlisted';
    tags?: string[];
    slug?: string;
  }
): Promise<ReadmeSaveResponse> => {
  try {
    const slug = options?.slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
      .from('readmes')
      .insert([
        {
          user_id: userId,
          title,
          description: options?.description || '',
          blocks,
          markdown_output: markdown,
          slug,
          is_public: options?.is_public ?? false,
          visibility: options?.visibility || 'private',
          tags: options?.tags || [],
          is_published: true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data?.id || '',
      title: data?.title || title,
      markdown,
      created_at: data?.created_at || new Date().toISOString(),
      success: true,
    };
  } catch (error) {
    console.error('[ReadmeService] Save error:', error);
    throw error;
  }
};

/**
 * Fetch README by ID
 */
export const fetchReadme = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('readmes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('[ReadmeService] Fetch error:', error);
    throw error;
  }
};

/**
 * Fetch all READMEs for current user
 */
export const fetchUserReadmes = async (userId: string, limit = 10, offset = 0) => {
  try {
    const { data, error, count } = await supabase
      .from('readmes')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return {
      readmes: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error('[ReadmeService] Fetch user readmes error:', error);
    throw error;
  }
};

/**
 * Update README
 */
export const updateReadme = async (
  readmeId: string,
  updates: Partial<ReadmeData>
): Promise<ReadmeSaveResponse> => {
  try {
    const { data, error } = await supabase
      .from('readmes')
      .update({
        title: updates.title,
        description: updates.description,
        blocks: updates.blocks,
        markdown_output: updates.markdown,
        is_public: updates.is_public,
        visibility: updates.visibility,
        tags: updates.tags,
      })
      .eq('id', readmeId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data?.id || readmeId,
      title: data?.title || updates.title || '',
      markdown: updates.markdown || '',
      created_at: data?.updated_at || new Date().toISOString(),
      success: true,
    };
  } catch (error) {
    console.error('[ReadmeService] Update error:', error);
    throw error;
  }
};

/**
 * Delete README
 */
export const deleteReadme = async (readmeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('readmes')
      .delete()
      .eq('id', readmeId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('[ReadmeService] Delete error:', error);
    throw error;
  }
};

/**
 * Clone a README
 */
export const cloneReadme = async (
  sourceReadmeId: string,
  userId: string,
  newTitle: string
): Promise<ReadmeSaveResponse> => {
  try {
    // Fetch original README
    const original = await fetchReadme(sourceReadmeId);

    if (!original) {
      throw new Error('README not found');
    }

    // Create clone
    const slug = newTitle
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
      .from('readmes')
      .insert([
        {
          user_id: userId,
          title: newTitle,
          description: original.description,
          blocks: original.blocks,
          markdown_output: original.markdown_output,
          slug,
          is_public: false,
          visibility: 'private',
          tags: original.tags,
          forked_from_readme_id: sourceReadmeId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data?.id || '',
      title: data?.title || newTitle,
      markdown: data?.markdown_output || original.markdown_output,
      created_at: data?.created_at || new Date().toISOString(),
      success: true,
    };
  } catch (error) {
    console.error('[ReadmeService] Clone error:', error);
    throw error;
  }
};

/**
 * Export README as markdown file
 */
export const exportAsMarkdown = (markdown: string, filename = 'README.md') => {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Copy markdown to clipboard
 */
export const copyToClipboard = async (markdown: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(markdown);
    return true;
  } catch (error) {
    console.error('[ReadmeService] Copy to clipboard error:', error);
    return false;
  }
};
