import rateLimit, { Options } from 'express-rate-limit';

const defaultOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
};

// General API rate limiter: 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Authentication rate limiter: 5 requests per 15 minutes
export const authLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req) => (req.body?.email as string) || (req.ip as string),
});

// Clone action limiter: 50 clones per 24 hours per user
export const cloneLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
  message: 'Clone limit reached. Try again tomorrow.',
  keyGenerator: (req) => (req.user as any)?.userId || (req.ip as string),
  skip: (req) => !(req.user) || process.env.NODE_ENV === 'test',
});

// Like action limiter: 500 likes per 24 hours per user
export const likeLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 24 * 60 * 60 * 1000,
  max: 500,
  message: 'Like limit reached. Try again tomorrow.',
  keyGenerator: (req) => (req.user as any)?.userId || (req.ip as string),
  skip: (req) => !(req.user) || process.env.NODE_ENV === 'test',
});

// Search limiter: 100 searches per 5 minutes
export const searchLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: 'Too many search requests, please try again later.',
});

// API endpoint limiter: 1000 requests per hour
export const apiLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later.',
});
