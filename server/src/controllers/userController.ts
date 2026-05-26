import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import * as readmeService from '../services/readmeService';
import { sendSuccess, sendPaginated, getPaginationParams } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { NotFoundError, AuthorizationError } from '../utils/errors';

/**
 * Get public user profile by username slug
 */
export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username_slug', username)
    .single();

  if (error || !profile) {
    throw new NotFoundError('User profile');
  }

  sendSuccess(res, profile);
});

/**
 * Get user's public READMEs
 */
export const getUserPublicReadmes = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const { limit, offset } = getPaginationParams(req.query);

  // Get user ID from username
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username_slug', username)
    .single();

  if (!profile) {
    throw new NotFoundError('User');
  }

  const { readmes, total } = await readmeService.getUserPublicReadmes(profile.id, limit, offset);
  sendPaginated(res, readmes, total, limit, offset);
});

/**
 * Get user's public templates
 */
export const getUserPublicTemplates = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const { limit, offset } = getPaginationParams(req.query);

  // Get user ID from username
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username_slug', username)
    .single();

  if (!profile) {
    throw new NotFoundError('User');
  }

  const { data: templates, error, count } = await supabase
    .from('templates')
    .select('*', { count: 'exact' })
    .eq('created_by', profile.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  sendPaginated(res, templates || [], count || 0, limit, offset);
});

/**
 * Get user profile for authenticated user
 */
export const getCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', req.user!.userId)
    .single();

  if (error || !profile) {
    throw new NotFoundError('User profile');
  }

  sendSuccess(res, profile);
});

/**
 * Update current user profile
 */
export const updateCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.validatedBody!;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', req.user!.userId)
    .select()
    .single();

  if (error) throw error;
  sendSuccess(res, profile);
});

/**
 * Get user settings
 */
export const getUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', req.user!.userId)
    .single();

  if (error) {
    // Create default settings if not found
    const { data: newSettings } = await supabase
      .from('user_settings')
      .insert([{ user_id: req.user!.userId }])
      .select()
      .single();

    return sendSuccess(res, newSettings);
  }

  sendSuccess(res, settings);
});

/**
 * Update user settings
 */
export const updateUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.validatedBody!;

  const { data: settings, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', req.user!.userId)
    .select()
    .single();

  if (error) throw error;
  sendSuccess(res, settings);
});

/**
 * Get user statistics
 */
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('total_readmes, total_clones, total_likes, follower_count')
    .eq('id', userId)
    .single();

  if (!profile) {
    throw new NotFoundError('User profile');
  }

  sendSuccess(res, profile);
});

/**
 * Get public user statistics (for public profile)
 */
export const getPublicUserStats = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('total_readmes, total_clones, total_likes, follower_count')
    .eq('username_slug', username)
    .single();

  if (!profile) {
    throw new NotFoundError('User');
  }

  sendSuccess(res, profile);
});
