import express from 'express';
import * as userController from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../validators';
import { updateProfileSchema, updateUserSettingsSchema } from '../validators';

const router = express.Router();

// Get current user profile
router.get('/profile', requireAuth, userController.getCurrentUserProfile);

// Update current user profile
router.put('/profile', requireAuth, validate(updateProfileSchema), userController.updateCurrentUserProfile);

// Get user settings
router.get('/settings', requireAuth, userController.getUserSettings);

// Update user settings
router.put('/settings', requireAuth, validate(updateUserSettingsSchema), userController.updateUserSettings);

// Get current user stats
router.get('/stats', requireAuth, userController.getUserStats);

// Get public user profile by username
router.get('/:username', userController.getPublicProfile);

// Get user's public READMEs
router.get('/:username/readmes', userController.getUserPublicReadmes);

// Get user's public templates
router.get('/:username/templates', userController.getUserPublicTemplates);

// Get public user stats
router.get('/:username/stats', userController.getPublicUserStats);

export default router;
