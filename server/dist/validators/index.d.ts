import Joi from 'joi';
export declare const createReadmeSchema: Joi.ObjectSchema<any>;
export declare const updateReadmeSchema: Joi.ObjectSchema<any>;
export declare const cloneReadmeSchema: Joi.ObjectSchema<any>;
export declare const createTemplateSchema: Joi.ObjectSchema<any>;
export declare const updateTemplateSchema: Joi.ObjectSchema<any>;
export declare const updateProfileSchema: Joi.ObjectSchema<any>;
export declare const updateUserSettingsSchema: Joi.ObjectSchema<any>;
export declare const createTagSchema: Joi.ObjectSchema<any>;
export declare const createCategorySchema: Joi.ObjectSchema<any>;
export declare const searchSchema: Joi.ObjectSchema<any>;
/**
 * Validation middleware factory
 * Usage: router.post('/endpoint', validate(schema), handler)
 */
export declare const validate: (schema: Joi.ObjectSchema) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=index.d.ts.map