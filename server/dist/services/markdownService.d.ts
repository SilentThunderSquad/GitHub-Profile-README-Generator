import { Block } from '../types';
/**
 * Generate markdown from README blocks
 */
export declare const generateMarkdownFromBlocks: (blocks: Block[]) => string;
/**
 * Generate markdown and save to database
 */
export declare const generateAndSaveMarkdown: (readmeId: string, blocks: Block[], userId: string) => Promise<any>;
/**
 * Get markdown for a README (with auth check)
 */
export declare const getMarkdownForReadme: (readmeId: string, userId?: string) => Promise<string>;
/**
 * Export README as .md file content
 */
export declare const exportReadmeAsMarkdown: (readmeId: string, userId?: string) => Promise<{
    filename: string;
    content: string;
}>;
//# sourceMappingURL=markdownService.d.ts.map