// Core type definitions for the application

export type Visibility = 'private' | 'public' | 'unlisted';
export type PermissionLevel = 'view' | 'edit' | 'admin';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SortBy = 'trending' | 'newest' | 'most-liked' | 'most-cloned' | 'popular';

// User Profile
export interface UserProfile {
  id: string;
  github_username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  twitter_handle?: string;
  linkedin_profile?: string;
  username_slug?: string;
  github_url?: string;
  portfolio_url?: string;
  follower_count: number;
  following_count: number;
  total_readmes: number;
  total_clones: number;
  total_likes: number;
  is_verified: boolean;
  featured_profile: boolean;
  created_at: string;
  updated_at: string;
}

// User Settings
export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  notifications_enabled: boolean;
  public_profile: boolean;
  autosave_enabled: boolean;
  autosave_interval_ms: number;
  created_at: string;
  updated_at: string;
}

// Block structure for README
export interface Block {
  id: string;
  type: string;
  data: Record<string, any>;
  position?: number;
}

// README
export interface README {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  blocks: Block[];
  markdown_output?: string;
  is_published: boolean;
  is_public: boolean;
  is_template: boolean;
  visibility: Visibility;
  template_id?: string;
  forked_from_readme_id?: string;
  view_count: number;
  clone_count: number;
  like_count: number;
  tags: string[];
  metadata: Record<string, any>;
  preview_image?: string;
  social_image?: string;
  seo_description?: string;
  seo_keywords?: string[];
  featured: boolean;
  community_pick: boolean;
  allow_cloning: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Template
export interface Template {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  category?: TemplateCategory;
  blocks: Block[];
  thumbnail_url?: string;
  preview_image_url?: string;
  demo_url?: string;
  is_featured: boolean;
  featured_rank?: number;
  is_official: boolean;
  allow_remix: boolean;
  created_by?: string;
  usage_count: number;
  clone_count: number;
  like_count: number;
  difficulty_level: DifficultyLevel;
  estimated_setup_time?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Template Category
export interface TemplateCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  created_at: string;
}

// Tag
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Clone tracking
export interface ReadmeClone {
  id: string;
  original_readme_id: string;
  cloned_readme_id: string;
  cloned_by_user_id: string;
  created_at: string;
}

// Like tracking
export interface ReadmeLike {
  id: string;
  readme_id: string;
  user_id: string;
  created_at: string;
}

// Search and filter options
export interface SearchFilters {
  query?: string;
  tags?: string[];
  category?: string;
  sortBy?: SortBy;
  visibility?: Visibility;
  limit?: number;
  offset?: number;
}

// Community README response (extends README with extra metadata)
export interface CommunityReadmeResponse extends README {
  author?: UserProfile;
  isLikedByUser?: boolean;
  tagObjects?: Tag[];
}

// API Response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  statusCode?: number;
  timestamp?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  limit: number;
  offset: number;
  timestamp?: string;
}

// Trending algorithm weights
export interface TrendingAlgorithm {
  cloneWeight: number;
  likeWeight: number;
  recencyWeight: number;
  decayFactor: number;
}

// JWT Payload
export interface JWTPayload {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: Record<string, any>;
  role?: string;
  aal?: string;
  amr?: Array<{ method: string; timestamp: number }>;
  session_id?: string;
  is_anonymous?: boolean;
}

// Context for authenticated requests
export interface AuthContext {
  userId: string;
  email: string;
  userRole: string;
  metadata?: Record<string, any>;
}

// Express Request type extensions
declare global {
  namespace Express {
    interface Request {
      user?: AuthContext;
      token?: string;
      id?: string;
      validatedBody?: Record<string, any>;
    }
  }
}

