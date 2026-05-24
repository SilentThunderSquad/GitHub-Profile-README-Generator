import { Express } from 'express';
/**
 * Centralized route loader - aggregates all routes in one place
 * Keeps route definitions manageable and easy to maintain
 */
export declare const loadRoutes: (app: Express) => void;
/**
 * Dynamic route loader for future use
 * Enables auto-discovery of route files from directory
 */
export declare const loadRoutesFromDirectory: (app: Express, dirname: string) => Promise<void>;
//# sourceMappingURL=routeLoader.d.ts.map