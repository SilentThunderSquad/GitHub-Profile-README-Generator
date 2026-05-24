import express from 'express';
import * as communityController from '../controllers/communityController';
import { searchLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Trending READMEs
router.get('/trending', communityController.getTrendingReadmes);

// Featured READMEs (community picks)
router.get('/featured', communityController.getFeaturedReadmes);

// Recent READMEs
router.get('/recent', communityController.getRecentReadmes);

// Search READMEs
router.get('/search', searchLimiter, communityController.searchReadmes);

// Get all tags
router.get('/tags', communityController.getTags);

// Get template categories
router.get('/categories', communityController.getCategories);

// Get templates by category
router.get('/templates/category/:slug', communityController.getTemplatesByCategory);

// Trending templates
router.get('/templates/trending', communityController.getTrendingTemplates);

// Featured templates
router.get('/templates/featured', communityController.getFeaturedTemplates);

export default router;
