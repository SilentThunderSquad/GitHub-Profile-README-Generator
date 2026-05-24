import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { AuthContext, JWTPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthContext;
      token?: string;
    }
  }
}

/**
 * Extract JWT token from Authorization header
 */
const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

/**
 * Verify JWT token with Supabase
 */
export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new AuthenticationError('Invalid token');
  }

  return {
    aud: user.aud,
    exp: Math.floor(new Date(user.confirmed_at || Date.now()).getTime() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    iss: 'supabase',
    sub: user.id,
    email: user.email || '',
    email_verified: user.email_confirmed_at !== null,
    phone_verified: user.phone_confirmed_at !== null,
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    role: user.role,
  };
};

/**
 * Middleware: Authenticate and extract user from token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new AuthenticationError('Missing authorization token');
    }

    const payload = await verifyToken(token);

    req.user = {
      userId: payload.sub,
      email: payload.email,
      userRole: payload.role || 'user',
      metadata: payload.user_metadata,
    };

    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Verify user is authenticated (throw if not)
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }
  next();
};

/**
 * Middleware: Verify user has specific role
 */
export const requireRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.userRole)) {
      throw new AuthorizationError(`Requires one of these roles: ${roles.join(', ')}`);
    }

    next();
  };
};

/**
 * Middleware: Optional authentication (doesn't fail if not authenticated)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const payload = await verifyToken(token);
      req.user = {
        userId: payload.sub,
        email: payload.email,
        userRole: payload.role || 'user',
        metadata: payload.user_metadata,
      };
      req.token = token;
    }
  } catch (error) {
    // Silently fail - user is optional
  }

  next();
};
