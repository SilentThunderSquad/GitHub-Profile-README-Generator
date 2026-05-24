import express from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
const router = express.Router();
// GitHub OAuth callback
router.post('/github/callback', authLimiter, authController.githubOAuthCallback);
// Refresh token
router.post('/refresh', authLimiter, authController.refreshToken);
// Logout
router.post('/logout', requireAuth, authController.logout);
// Get current user
router.get('/me', requireAuth, authController.getCurrentUser);
// Verify token
router.post('/verify', authController.verifyToken);
export default router;
//# sourceMappingURL=auth.js.map