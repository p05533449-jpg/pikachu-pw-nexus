import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const codeSchema = z.object({ code: z.string().min(1).max(200) });

const platformSchema = codeSchema.extend({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(80),
  url: z.string().trim().min(3).max(2000),
  logo_url: z.string().max(1_000_000).nullable().optional(),
  visible: z.boolean().optional(),
  maintenance: z.boolean().optional(),
});


const settingsSchema = codeSchema.extend({
  brand_name: z.string().trim().min(1).max(60),
  welcome_title: z.string().trim().min(1).max(80),
  welcome_subtitle: z.string().trim().max(160),
  welcome_button: z.string().trim().min(1).max(60),
  home_title: z.string().trim().min(1).max(120),
  home_subtitle: z.string().trim().max(240),
  mascot_url: z.string().max(1_000_000).nullable().optional(),
  banner_url: z.string().max(1_000_000).nullable().optional(),
  accent_color: z.string().trim().max(40),
});

export const verifyAdminCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => codeSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./site.server");
    assertAdmin(data.code);
    return { ok: true as const };
  });

export const savePlatform = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => platformSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertAdmin, admin, sanitizeUrl, sanitizeImage } = await import("./site.server");
    assertAdmin(data.code);
    const db = admin();
    const payload = {
      name: data.name,
      url: sanitizeUrl(data.url),
      logo_url: sanitizeImage(data.logo_url ?? null),
      visible: data.visible ?? true,
      maintenance: data.maintenance ?? false,
      updated_at: new Date().toISOString(),
    };


    if (data.id) {
      const { error } = await db.from("platforms").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const };
    }

    const { data: last } = await db
      .from("platforms")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const nextPosition = (last?.[0]?.position ?? 0) + 1;
    const { error } = await db.from("platforms").insert({ ...payload, position: nextPosition });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deletePlatform = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => codeSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { assertAdmin, admin } = await import("./site.server");
    assertAdmin(data.code);
    const { error } = await admin().from("platforms").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const togglePlatform = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    codeSchema
      .extend({
        id: z.string().uuid(),
        visible: z.boolean().optional(),
        maintenance: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { assertAdmin, admin } = await import("./site.server");
    assertAdmin(data.code);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof data.visible === "boolean") patch.visible = data.visible;
    if (typeof data.maintenance === "boolean") patch.maintenance = data.maintenance;
    const { error } = await admin().from("platforms").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });


export const reorderPlatforms = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    codeSchema.extend({ ids: z.array(z.string().uuid()).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { assertAdmin, admin } = await import("./site.server");
    assertAdmin(data.code);
    const db = admin();
    for (let i = 0; i < data.ids.length; i++) {
      const { error } = await db
        .from("platforms")
        .update({ position: i + 1 })
        .eq("id", data.ids[i]!);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => settingsSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertAdmin, admin, sanitizeImage } = await import("./site.server");
    assertAdmin(data.code);
    const { code: _code, ...rest } = data;
    const { error } = await admin()
      .from("site_settings")
      .update({
        ...rest,
        mascot_url: sanitizeImage(rest.mascot_url ?? null),
        banner_url: sanitizeImage(rest.banner_url ?? null),
        updated_at: new Date().toISOString(),
      })
      .eq("id", "main");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
