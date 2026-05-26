import { Request, Response } from 'express';
import * as communityService from '../services/communityService';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Get trending READMEs
 */
export const getTrendingReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { tags } = req.query;
  const tagArray = tags ? (Array.isArray(tags) ? (tags as string[]) : [tags as string]) : undefined;

  const { readmes, total } = await communityService.getTrendingReadmes(limit, offset, { tags: tagArray });
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Get featured READMEs
 */
export const getFeaturedReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { readmes, total } = await communityService.getFeaturedReadmes(limit, offset);
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Get recent READMEs
 */
export const getRecentReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { readmes, total } = await communityService.getRecentReadmes(limit, offset);
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Search READMEs
 */
export const searchReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { query, tags, category, sortBy, visibility } = req.query;

  const filters = {
    query: typeof query === 'string' ? query : undefined,
    tags: tags ? (Array.isArray(tags) ? (tags as string[]) : [tags as string]) : undefined,
    category: typeof category === 'string' ? category : undefined,
    sortBy: typeof sortBy === 'string' ? (sortBy as any) : undefined,
    visibility: typeof visibility === 'string' ? (visibility as any) : undefined,
  };

  const { readmes, total } = await communityService.searchReadmes(filters, limit, offset);
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Get all tags
 */
export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 100 } = req.query;
  const tags = await communityService.getAllTags(parseInt(limit as string) || 100);
  sendSuccess(res, { tags });
});

/**
 * Get template categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await communityService.getTemplateCategories();
  sendSuccess(res, { categories });
});

/**
 * Get templates by category
 */
export const getTemplatesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { slug } = req.params;

  const { templates, total } = await communityService.getTemplatesByCategory(slug, limit, offset);
  sendPaginated(res, templates, total, limit, offset);
});

/**
 * Get trending templates
 */
export const getTrendingTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { templates, total } = await communityService.getTrendingTemplates(limit, offset);
  sendPaginated(res, templates, total, limit, offset);
});

/**
 * Get featured templates
 */
export const getFeaturedTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = getPaginationParams(req.query);
  const { templates, total } = await communityService.getFeaturedTemplates(limit, offset);
  sendPaginated(res, templates, total, limit, offset);
});
