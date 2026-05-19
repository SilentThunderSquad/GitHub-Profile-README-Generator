import { supabase, supabaseAdmin } from '../config/supabase';
import { README, Block } from '../types';

/**
 * Generate markdown from README blocks
 */
export const generateMarkdownFromBlocks = (blocks: Block[]): string => {
  let markdown = '';

  blocks.forEach((block) => {
    switch (block.type) {
      case 'header':
        markdown += `# ${block.data.title || ''}\n`;
        if (block.data.subtitle) {
          markdown += `*${block.data.subtitle}*\n`;
        }
        markdown += '\n';
        break;

      case 'about':
        markdown += `## About\n\n${block.data.content || ''}\n\n`;
        break;

      case 'skills':
        markdown += `## Skills\n\n`;
        if (block.data.skills && Array.isArray(block.data.skills)) {
          block.data.skills.forEach((skill: any) => {
            markdown += `- ${skill.name || skill}${skill.level ? ` (${skill.level})` : ''}\n`;
          });
        }
        markdown += '\n';
        break;

      case 'projects':
        markdown += `## Projects\n\n`;
        if (block.data.projects && Array.isArray(block.data.projects)) {
          block.data.projects.forEach((project: any) => {
            markdown += `### ${project.title || 'Untitled'}\n`;
            if (project.description) markdown += `${project.description}\n`;
            if (project.link) markdown += `[View Project](${project.link})\n`;
            markdown += '\n';
          });
        }
        break;

      case 'github-stats':
        markdown += `## GitHub Stats\n\n`;
        const username = block.data.username || '';
        if (username) {
          markdown += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&theme=dark)\n`;
          if (block.data.showLanguages) {
            markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=dark)\n`;
          }
        }
        markdown += '\n';
        break;

      case 'contact':
      case 'social-links':
        markdown += `## Get in Touch\n\n`;
        if (block.data.links && Array.isArray(block.data.links)) {
          block.data.links.forEach((link: any) => {
            markdown += `- [${link.platform || link.label}](${link.url})\n`;
          });
        }
        markdown += '\n';
        break;

      case 'badges':
        markdown += `\n`;
        if (block.data.badges && Array.isArray(block.data.badges)) {
          block.data.badges.forEach((badge: any) => {
            if (badge.url) {
              markdown += `[![${badge.label}](${badge.imageUrl})](${badge.url}) `;
            } else {
              markdown += `![${badge.label}](${badge.imageUrl}) `;
            }
          });
        }
        markdown += '\n\n';
        break;

      case 'code-block':
        markdown += `\`\`\`${block.data.language || ''}\n${block.data.code || ''}\n\`\`\`\n\n`;
        break;

      case 'quote':
        markdown += `> ${block.data.quote || ''}\n`;
        if (block.data.author) markdown += `> — ${block.data.author}\n`;
        markdown += '\n';
        break;

      case 'table':
        if (block.data.rows && block.data.columns) {
          markdown += `| ${block.data.columns.join(' | ')} |\n`;
          markdown += `| ${block.data.columns.map(() => '---').join(' | ')} |\n`;
          block.data.rows.forEach((row: any) => {
            markdown += `| ${row.join(' | ')} |\n`;
          });
        }
        markdown += '\n';
        break;

      case 'image':
        if (block.data.url) {
          markdown += `![${block.data.alt || 'Image'}](${block.data.url})\n`;
          if (block.data.caption) markdown += `*${block.data.caption}*\n`;
        }
        markdown += '\n';
        break;

      case 'custom':
      case 'html':
        markdown += `${block.data.content || ''}\n\n`;
        break;

      default:
        if (block.data.content) {
          markdown += `${block.data.content}\n\n`;
        }
    }
  });

  return markdown.trim();
};

/**
 * Generate markdown and save to database
 */
export const generateAndSaveMarkdown = async (readmeId: string, blocks: Block[], userId: string) => {
  const markdown = generateMarkdownFromBlocks(blocks);

  const { data, error } = await supabase
    .from('readmes')
    .update({ markdown_output: markdown })
    .eq('id', readmeId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get markdown for a README (with auth check)
 */
export const getMarkdownForReadme = async (readmeId: string, userId?: string): Promise<string> => {
  const { data: readme, error } = await supabase
    .from('readmes')
    .select('markdown_output, is_public, user_id')
    .eq('id', readmeId)
    .single();

  if (error) throw error;
  if (!readme) throw new Error('README not found');

  // Check access
  if (!readme.is_public && readme.user_id !== userId) {
    throw new Error('Not authorized to access this README');
  }

  return readme.markdown_output || '';
};

/**
 * Export README as .md file content
 */
export const exportReadmeAsMarkdown = async (
  readmeId: string,
  userId?: string
): Promise<{ filename: string; content: string }> => {
  const { data: readme, error } = await supabase
    .from('readmes')
    .select('title, markdown_output, is_public, user_id')
    .eq('id', readmeId)
    .single();

  if (error) throw error;
  if (!readme) throw new Error('README not found');

  // Check access
  if (!readme.is_public && readme.user_id !== userId) {
    throw new Error('Not authorized to access this README');
  }

  const filename = `${(readme.title || 'README').replace(/\s+/g, '-').toLowerCase()}.md`;
  const content = readme.markdown_output || '';

  return { filename, content };
};
