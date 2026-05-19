import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticationError, ValidationError } from '../utils/errors';

/**
 * GitHub OAuth callback - handles auth code from GitHub
 * Exchanges code for session and creates/updates user profile
 */
export const githubOAuthCallback = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    throw new ValidationError('GitHub auth code is required');
  }

  try {
    // Exchange code for session with Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      throw new AuthenticationError('Failed to exchange code for session');
    }

    const { session, user } = data;

    // Ensure user profile exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Create new user profile from GitHub data
      const githubUsername = user.user_metadata?.user_name || '';
      const slug = githubUsername.toLowerCase() || user.id.slice(0, 8);

      await supabase.from('user_profiles').insert([
        {
          id: user.id,
          github_username: githubUsername,
          display_name: user.user_metadata?.full_name || githubUsername,
          avatar_url: user.user_metadata?.avatar_url,
          github_url: `https://github.com/${githubUsername}`,
          username_slug: slug,
        },
      ]);

      // Create default user settings
      await supabase.from('user_settings').insert([
        {
          user_id: user.id,
          theme: 'dark',
          notifications_enabled: true,
          public_profile: false,
          autosave_enabled: true,
          autosave_interval_ms: 5000,
        },
      ]);
    }

    sendSuccess(res, {
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        token_type: session.token_type,
      },
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
    });
  } catch (error) {
    console.error('[Auth] GitHub OAuth error:', error);
    throw error;
  }
});

/**
 * Refresh token - get new access token using refresh token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      throw new AuthenticationError('Failed to refresh token');
    }

    sendSuccess(res, {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
    });
  } catch (error) {
    console.error('[Auth] Token refresh error:', error);
    throw error;
  }
});

/**
 * Logout - invalidate session
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthenticationError('Failed to logout');
    }

    sendSuccess(res, {
      message: 'Successfully logged out',
    });
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    throw error;
  }
});

/**
 * Get current authenticated user
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', req.user.userId)
    .single();

  sendSuccess(res, {
    id: req.user.userId,
    email: req.user.email,
    profile,
  });
});

/**
 * Verify authentication token validity
 */
export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('Invalid or expired token');
  }

  sendSuccess(res, {
    valid: true,
    user: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.userRole,
    },
  });
});
