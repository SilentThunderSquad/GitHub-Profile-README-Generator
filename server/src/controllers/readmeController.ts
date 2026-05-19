import { Request, Response, NextFunction } from 'express';
import * as readmeService from '../services/readmeService';
import * as markdownService from '../services/markdownService';
import * as cloneService from '../services/cloneService';
import * as likeService from '../services/likeService';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { README } from '../types';

/**
 * Create a new README
 */
export const createReadme = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, slug, blocks, is_public, visibility, tags, seo_description, seo_keywords } = req.validatedBody!;

  const readme = await readmeService.createReadme(req.user!.userId, title, {
    description,
    slug,
    blocks,
    is_public,
    visibility,
    tags,
    seo_description,
    seo_keywords,
  });

  sendSuccess(res, readme, 201);
});

/**
 * Get README by ID
 */
export const getReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const readme = await readmeService.getReadmeById(id, req.user?.userId);

  // Increment view count in background
  readmeService.getReadmeById(id, req.user?.userId).catch(() => {});

  sendSuccess(res, readme);
});

/**
 * Update README
 */
export const updateReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const readme = await readmeService.updateReadme(id, req.user!.userId, req.validatedBody!);
  sendSuccess(res, readme);
});

/**
 * Delete README
 */
export const deleteReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await readmeService.deleteReadme(id, req.user!.userId);
  sendSuccess(res, { message: 'README deleted successfully' });
});

/**
 * Get user's READMEs
 */
export const getUserReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { readmes, total } = await readmeService.getUserReadmes(req.user!.userId, limit, offset);
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Clone README
 */
export const cloneReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.validatedBody!;

  const cloned = await cloneService.cloneReadme(id, req.user!.userId, title, description);
  sendSuccess(res, cloned, 201);
});

/**
 * Get clone details
 */
export const getCloneDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const details = await cloneService.getReadmeCloneDetails(id);
  sendSuccess(res, details);
});

/**
 * Publish README
 */
export const publishReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const published = await readmeService.publishReadme(id, req.user!.userId);
  sendSuccess(res, published);
});

/**
 * Autosave README
 */
export const autosaveReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { blocks } = req.body;

  const updated = await readmeService.autosaveReadme(id, req.user!.userId, blocks);
  sendSuccess(res, updated);
});

/**
 * Get generated markdown
 */
export const getMarkdown = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const markdown = await markdownService.getMarkdownForReadme(id, req.user?.userId);
  sendSuccess(res, { markdown });
});

/**
 * Export README as .md file
 */
export const exportReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { filename, content } = await markdownService.exportReadmeAsMarkdown(id, req.user?.userId);

  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
});

/**
 * Like README
 */
export const likeReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await likeService.likeReadme(id, req.user!.userId);
  sendSuccess(res, result, 201);
});

/**
 * Unlike README
 */
export const unlikeReadme = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await likeService.unlikeReadme(id, req.user!.userId);
  sendSuccess(res, result);
});

/**
 * Get like details
 */
export const getLikeDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const likeCount = await likeService.getLikeCount(id);
  const isLiked = await likeService.hasUserLikedReadme(id, req.user?.userId || '');
  const recentLikers = await likeService.getRecentLikers(id);

  sendSuccess(res, { likeCount, isLiked, recentLikers });
});

/**
 * Change README visibility
 */
export const changeVisibility = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { visibility } = req.body;

  const updated = await readmeService.changeReadmeVisibility(id, req.user!.userId, visibility);
  sendSuccess(res, updated);
});

/**
 * Add tags to README
 */
export const addTags = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tags } = req.body;

  await readmeService.addReadmeTags(id, req.user!.userId, tags);
  sendSuccess(res, { message: 'Tags added successfully' });
});
