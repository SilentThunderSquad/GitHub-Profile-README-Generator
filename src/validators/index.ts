import Joi from 'joi';

// README validation schemas
export const createReadmeSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(1000),
  slug: Joi.string().lowercase().regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/).min(3).max(50),
  blocks: Joi.array().items(Joi.object()),
  is_public: Joi.boolean(),
  visibility: Joi.string().valid('private', 'public', 'unlisted'),
  tags: Joi.array().items(Joi.string()),
  seo_description: Joi.string().max(160),
  seo_keywords: Joi.array().items(Joi.string()),
});

export const updateReadmeSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().max(1000),
  blocks: Joi.array().items(Joi.object()),
  is_public: Joi.boolean(),
  visibility: Joi.string().valid('private', 'public', 'unlisted'),
  is_published: Joi.boolean(),
  tags: Joi.array().items(Joi.string()),
  preview_image: Joi.string().uri(),
  seo_description: Joi.string().max(160),
  seo_keywords: Joi.array().items(Joi.string()),
}).min(1);

export const cloneReadmeSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().max(1000),
  is_public: Joi.boolean(),
});

// Template validation schemas
export const createTemplateSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(1000),
  blocks: Joi.array().items(Joi.object()).required(),
  category_id: Joi.string().uuid(),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  estimated_setup_time: Joi.number().min(1).max(1440),
  tags: Joi.array().items(Joi.string()),
  thumbnail_url: Joi.string().uri(),
});

export const updateTemplateSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().max(1000),
  blocks: Joi.array().items(Joi.object()),
  category_id: Joi.string().uuid(),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  estimated_setup_time: Joi.number().min(1).max(1440),
  tags: Joi.array().items(Joi.string()),
  thumbnail_url: Joi.string().uri(),
}).min(1);

// User profile validation
export const updateProfileSchema = Joi.object({
  display_name: Joi.string().max(255),
  bio: Joi.string().max(500),
  location: Joi.string().max(100),
  website_url: Joi.string().uri().allow(''),
  twitter_handle: Joi.string().max(50).regex(/^[A-Za-z0-9_]+$/),
  linkedin_profile: Joi.string().uri(),
  portfolio_url: Joi.string().uri(),
  avatar_url: Joi.string().uri(),
}).min(1);

export const updateUserSettingsSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark'),
  notifications_enabled: Joi.boolean(),
  public_profile: Joi.boolean(),
  autosave_enabled: Joi.boolean(),
  autosave_interval_ms: Joi.number().min(1000).max(60000),
}).min(1);

// Tag validation
export const createTagSchema = Joi.object({
  name: Joi.string().lowercase().max(50).required(),
  slug: Joi.string().lowercase().regex(/^[a-z0-9-]+$/).max(50).required(),
});

// Category validation
export const createCategorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  slug: Joi.string().lowercase().regex(/^[a-z0-9-]+$/).max(100).required(),
  icon: Joi.string().max(50),
});

// Search validation
export const searchSchema = Joi.object({
  query: Joi.string().max(200),
  tags: Joi.array().items(Joi.string()),
  category: Joi.string().max(100),
  sortBy: Joi.string().valid('trending', 'newest', 'most-liked', 'most-cloned', 'popular'),
  limit: Joi.number().min(1).max(100),
  offset: Joi.number().min(0),
});

/**
 * Validation middleware factory
 * Usage: router.post('/endpoint', validate(schema), handler)
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: messages,
        statusCode: 400,
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedBody = value;
    next();
  };
};
