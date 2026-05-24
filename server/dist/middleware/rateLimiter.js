import rateLimit from 'express-rate-limit';
// General API rate limiter: 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'test',
});
// Authentication rate limiter: 5 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.body?.email || req.ip,
});
// Clone action limiter: 50 clones per 24 hours per user
export const cloneLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 50,
    message: 'Clone limit reached. Try again tomorrow.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.userId || req.ip,
    skip: (req) => !(req.user),
});
// Like action limiter: 500 likes per 24 hours per user
export const likeLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 500,
    message: 'Like limit reached. Try again tomorrow.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.userId || req.ip,
    skip: (req) => !(req.user),
});
// Search limiter: 100 searches per 5 minutes
export const searchLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many search requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// API endpoint limiter: 1000 requests per hour
export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map