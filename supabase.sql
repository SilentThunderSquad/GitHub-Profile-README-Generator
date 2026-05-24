-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username VARCHAR(255) UNIQUE,
  display_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  website_url TEXT,
  twitter_handle VARCHAR(255),
  linkedin_profile TEXT,
  username_slug VARCHAR(255) UNIQUE,
  github_url TEXT,
  portfolio_url TEXT,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_readmes INTEGER DEFAULT 0,
  total_clones INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  featured_profile BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  public_profile BOOLEAN DEFAULT FALSE,
  autosave_enabled BOOLEAN DEFAULT TRUE,
  autosave_interval_ms INTEGER DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template categories table
CREATE TABLE public.template_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- READMEs table
CREATE TABLE public.readmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  blocks JSONB NOT NULL DEFAULT '[]',
  markdown_output TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  visibility VARCHAR(50) DEFAULT 'private',
  template_id UUID REFERENCES public.readmes(id) ON DELETE SET NULL,
  forked_from_readme_id UUID REFERENCES public.readmes(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  community_pick BOOLEAN DEFAULT FALSE,
  allow_cloning BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  preview_image TEXT,
  social_image TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, slug)
);

-- Templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.template_categories(id) ON DELETE SET NULL,
  blocks JSONB NOT NULL DEFAULT '[]',
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_rank INTEGER,
  is_official BOOLEAN DEFAULT FALSE,
  allow_remix BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 0,
  clone_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  difficulty_level VARCHAR(50) DEFAULT 'beginner',
  estimated_setup_time INTEGER,
  tags TEXT[] DEFAULT '{}',
  preview_image_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocks table (for detailed block history/versioning)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- README clones tracking
CREATE TABLE public.readme_clones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  cloned_readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  cloned_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cloned_readme_id)
);

-- README likes tracking
CREATE TABLE public.readme_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(readme_id, user_id)
);

-- README tags association
CREATE TABLE public.readme_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(readme_id, tag_id)
);

-- Shared readmes/collaborators table
CREATE TABLE public.readme_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  readme_id UUID NOT NULL REFERENCES public.readmes(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email VARCHAR(255),
  permission_level VARCHAR(50) DEFAULT 'view',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(readme_id, shared_with_user_id)
);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_username_slug ON public.user_profiles(username_slug);
CREATE INDEX idx_user_profiles_featured ON public.user_profiles(featured_profile);

CREATE INDEX idx_readmes_user_id ON public.readmes(user_id);
CREATE INDEX idx_readmes_published ON public.readmes(is_published);
CREATE INDEX idx_readmes_is_public ON public.readmes(is_public);
CREATE INDEX idx_readmes_visibility ON public.readmes(visibility);
CREATE INDEX idx_readmes_featured ON public.readmes(featured);
CREATE INDEX idx_readmes_community_pick ON public.readmes(community_pick);
CREATE INDEX idx_readmes_clone_count ON public.readmes(clone_count);
CREATE INDEX idx_readmes_like_count ON public.readmes(like_count);
CREATE INDEX idx_readmes_template ON public.readmes(is_template);
CREATE INDEX idx_readmes_created_at ON public.readmes(created_at);
CREATE INDEX idx_readmes_tags ON public.readmes USING GIN(tags);

CREATE INDEX idx_templates_category_id ON public.templates(category_id);
CREATE INDEX idx_templates_featured ON public.templates(is_featured);
CREATE INDEX idx_templates_featured_rank ON public.templates(featured_rank);
CREATE INDEX idx_templates_difficulty ON public.templates(difficulty_level);
CREATE INDEX idx_templates_official ON public.templates(is_official);
CREATE INDEX idx_templates_clone_count ON public.templates(clone_count);
CREATE INDEX idx_templates_like_count ON public.templates(like_count);

CREATE INDEX idx_blocks_readme_id ON public.blocks(readme_id);

CREATE INDEX idx_readme_clones_original ON public.readme_clones(original_readme_id);
CREATE INDEX idx_readme_clones_user ON public.readme_clones(cloned_by_user_id);
CREATE INDEX idx_readme_clones_created_at ON public.readme_clones(created_at);

CREATE INDEX idx_readme_likes_readme ON public.readme_likes(readme_id);
CREATE INDEX idx_readme_likes_user ON public.readme_likes(user_id);
CREATE INDEX idx_readme_likes_created_at ON public.readme_likes(created_at);

CREATE INDEX idx_tags_slug ON public.tags(slug);

CREATE INDEX idx_readme_tags_readme ON public.readme_tags(readme_id);
CREATE INDEX idx_readme_tags_tag ON public.readme_tags(tag_id);

CREATE INDEX idx_readme_shares_readme_id ON public.readme_shares(readme_id);
CREATE INDEX idx_readme_shares_user_id ON public.readme_shares(shared_with_user_id);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readme_clones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readme_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readme_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readme_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Public read, owner write
CREATE POLICY "Allow public read of profiles" ON public.user_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Allow users to update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User settings: Private, owner only
CREATE POLICY "Allow users to read own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- READMEs: Owner full access, published readable
CREATE POLICY "Allow users to read own readmes" ON public.readmes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow public read of published readmes" ON public.readmes FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Allow users to create readmes" ON public.readmes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update own readmes" ON public.readmes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own readmes" ON public.readmes FOR DELETE USING (auth.uid() = user_id);

-- Templates: Public read
CREATE POLICY "Allow public read of templates" ON public.templates FOR SELECT USING (TRUE);

-- Blocks: Private, owner only
CREATE POLICY "Allow users to read own blocks" ON public.blocks FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.readmes WHERE id = blocks.readme_id)
);

-- README clones: Users can read clones of their own READMEs
CREATE POLICY "Allow users to read clones of own readmes" ON public.readme_clones FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.readmes WHERE id = original_readme_id) OR
  auth.uid() = cloned_by_user_id
);

-- README likes: Users can read likes, create/delete own
CREATE POLICY "Allow users to read likes" ON public.readme_likes FOR SELECT USING (TRUE);
CREATE POLICY "Allow users to like readmes" ON public.readme_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to unlike readmes" ON public.readme_likes FOR DELETE USING (auth.uid() = user_id);

-- Tags: Public read
CREATE POLICY "Allow public read of tags" ON public.tags FOR SELECT USING (TRUE);

-- README tags: Read based on parent README visibility
CREATE POLICY "Allow users to read tags of visible readmes" ON public.readme_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.readmes r WHERE r.id = readme_id AND (r.is_public = TRUE OR auth.uid() = r.user_id)
  )
);

-- Audit logs: Private, own logs only
CREATE POLICY "Allow users to read own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readmes_updated_at BEFORE UPDATE ON public.readmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
