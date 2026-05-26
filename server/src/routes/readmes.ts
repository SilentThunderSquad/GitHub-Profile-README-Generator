import express from 'express';
import * as readmeController from '../controllers/readmeController';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validate } from '../validators';
import { createReadmeSchema, updateReadmeSchema, cloneReadmeSchema, searchSchema } from '../validators';
import { cloneLimiter, likeLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Create README
router.post('/', requireAuth, validate(createReadmeSchema), readmeController.createReadme);

// Get user's READMEs
router.get('/my', requireAuth, readmeController.getUserReadmes);

// Clone README
router.post('/:id/clone', requireAuth, cloneLimiter, validate(cloneReadmeSchema), readmeController.cloneReadme);

// Get clone details
router.get('/:id/clones', readmeController.getCloneDetails);

// Like README
router.post('/:id/like', requireAuth, likeLimiter, readmeController.likeReadme);

// Unlike README
router.delete('/:id/like', requireAuth, readmeController.unlikeReadme);

// Get like details
router.get('/:id/likes', readmeController.getLikeDetails);

// Publish README
router.post('/:id/publish', requireAuth, readmeController.publishReadme);

// Autosave README
router.post('/:id/autosave', requireAuth, readmeController.autosaveReadme);

// Get markdown
router.get('/:id/markdown', optionalAuth, readmeController.getMarkdown);

// Export as .md file
router.get('/:id/export', optionalAuth, readmeController.exportReadme);

// Change visibility
router.patch('/:id/visibility', requireAuth, readmeController.changeVisibility);

// Add tags
router.post('/:id/tags', requireAuth, readmeController.addTags);

// Get README
router.get('/:id', optionalAuth, readmeController.getReadme);

// Update README
router.put('/:id', requireAuth, validate(updateReadmeSchema), readmeController.updateReadme);

// Delete README
router.delete('/:id', requireAuth, readmeController.deleteReadme);

export default router;
