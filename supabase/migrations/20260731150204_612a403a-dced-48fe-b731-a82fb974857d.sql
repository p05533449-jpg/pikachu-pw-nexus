CREATE TABLE public.platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
  brand_name TEXT NOT NULL DEFAULT 'PW Nexus',
  welcome_title TEXT NOT NULL DEFAULT 'PW Nexus',
  welcome_subtitle TEXT NOT NULL DEFAULT '',
  welcome_button TEXT NOT NULL DEFAULT '🔥 Open Now 🔥',
  home_title TEXT NOT NULL DEFAULT 'Welcome to PW Nexus',
  home_subtitle TEXT NOT NULL DEFAULT 'Your Premium Learning Sanctuary. Fast, clean, and distraction-free.',
  mascot_url TEXT,
  banner_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#22e57f',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.platforms TO anon, authenticated;
GRANT ALL ON public.platforms TO service_role;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platforms are publicly readable" ON public.platforms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Site settings are publicly readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.platforms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER TABLE public.platforms REPLICA IDENTITY FULL;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;

INSERT INTO public.site_settings (id) VALUES ('main');

INSERT INTO public.platforms (name, url, position) VALUES
  ('Physics Wallah', 'https://www.pw.live', 1),
  ('Next Toppers', 'https://www.nexttoppers.com', 2),
  ('Mission JEET', 'https://missionjeet.com', 3),
  ('RWA', 'https://rojgarwithankit.com', 4);