import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Platform = {
  id: string;
  name: string;
  url: string;
  logo_url: string | null;
  position: number;
  visible: boolean;
};

export type SiteSettings = {
  id: string;
  brand_name: string;
  welcome_title: string;
  welcome_subtitle: string;
  welcome_button: string;
  home_title: string;
  home_subtitle: string;
  mascot_url: string | null;
  banner_url: string | null;
  accent_color: string;
  updated_at?: string;
};

async function fetchPlatforms(): Promise<Platform[]> {
  const { data, error } = await supabase
    .from("platforms")
    .select("id,name,url,logo_url,position,visible")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Platform[];
}

async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as SiteSettings) ?? null;
}

/** Live site content: platforms + settings, kept in sync for every visitor. */
export function useSiteContent() {
  const queryClient = useQueryClient();

  const platforms = useQuery({ queryKey: ["platforms"], queryFn: fetchPlatforms });
  const settings = useQuery({ queryKey: ["site_settings"], queryFn: fetchSettings });

  useEffect(() => {
    const channel = supabase
      .channel("site-content")
      .on("postgres_changes", { event: "*", schema: "public", table: "platforms" }, () => {
        queryClient.invalidateQueries({ queryKey: ["platforms"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    platforms: platforms.data ?? [],
    visiblePlatforms: (platforms.data ?? []).filter((p) => p.visible),
    settings: settings.data ?? null,
    isLoading: platforms.isLoading || settings.isLoading,
    error: platforms.error ?? settings.error ?? null,
  };
}
