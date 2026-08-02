import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  ArrowLeft,
  Wrench,
  Upload,
  Monitor,
  ExternalLink,
} from "lucide-react";

import { useSiteContent, type Platform } from "@/hooks/useSiteContent";
import { PlatformLogo } from "@/components/PlatformLogo";
import { fileToCompressedDataUrl } from "@/lib/image";
import {
  deletePlatform,
  reorderPlatforms,
  savePlatform,
  saveSettings,
  togglePlatform,
  verifyAdminCode,
} from "@/lib/site.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Control Center — PW Nexus" },
      { name: "description", content: "Private control center for managing PW Nexus content." },
      { property: "og:title", content: "Control Center — PW Nexus" },
      { property: "og:description", content: "Private control center for PW Nexus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const input =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none transition-shadow focus:accent-ring";
const btn =
  "rounded-2xl bg-primary px-5 py-3 font-display text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60";
const ghostBtn =
  "rounded-2xl border border-border bg-surface-2 px-4 py-3 font-display text-sm transition-colors hover:bg-surface disabled:opacity-60";

function AdminPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const verify = useServerFn(verifyAdminCode);

  useEffect(() => {
    const saved = sessionStorage.getItem("nexus-admin");
    if (!saved) return;
    verify({ data: { code: saved } })
      .then(() => {
        setCode(saved);
        setUnlocked(true);
      })
      .catch(() => sessionStorage.removeItem("nexus-admin"));
  }, [verify]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      await verify({ data: { code } });
      sessionStorage.setItem("nexus-admin", code);
      setUnlocked(true);
      toast.success("Welcome back");
    } catch {
      toast.error("Invalid Admin Code");
    } finally {
      setChecking(false);
    }
  };

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={submit}
          className="glass-panel animate-rise w-full max-w-sm space-y-4 rounded-3xl p-6"
        >
          <h1 className="font-display text-2xl font-bold">Control Center</h1>
          <p className="text-sm text-muted-foreground">Enter your access code to continue.</p>
          <input
            type="password"
            value={code}
            autoComplete="off"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className={input}
          />
          <button type="submit" disabled={checking || !code} className={`${btn} w-full`}>
            {checking ? "Checking…" : "Unlock"}
          </button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:underline">
            Back to home
          </Link>
        </form>
      </main>
    );
  }

  return <AdminDashboard code={code} />;
}

function AdminDashboard({ code }: { code: string }) {
  const { platforms, settings } = useSiteContent();
  const [tab, setTab] = useState<"platforms" | "appearance">("platforms");

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 pb-20">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-5">
        <Link to="/" className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">Control Center</h1>
          <p className="text-xs text-muted-foreground">
            {platforms.length} platforms · {platforms.filter((p) => p.visible).length} live
          </p>
        </div>
      </header>

      <div className="mb-5 flex gap-2">
        {(["platforms", "appearance"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-2xl px-4 py-3 font-display text-sm capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "platforms" ? (
        <PlatformsTab code={code} platforms={platforms} />
      ) : (
        <AppearanceTab code={code} settings={settings} />
      )}
    </main>
  );
}

function PlatformsTab({ code, platforms }: { code: string; platforms: Platform[] }) {
  const [editing, setEditing] = useState<Platform | "new" | null>(null);
  const save = useServerFn(savePlatform);
  const remove = useServerFn(deletePlatform);
  const toggle = useServerFn(togglePlatform);
  const reorder = useServerFn(reorderPlatforms);
  const dragId = useRef<string | null>(null);

  const onDrop = async (targetId: string) => {
    const from = dragId.current;
    dragId.current = null;
    if (!from || from === targetId) return;
    const ids = platforms.map((p) => p.id);
    const next = ids.filter((i) => i !== from);
    next.splice(ids.indexOf(targetId), 0, from);
    try {
      await reorder({ data: { code, ids: next } });
      toast.success("Order updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not reorder");
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className={`${btn} flex w-full items-center justify-center gap-2`}
      >
        <Plus className="h-4 w-4" /> Add platform
      </button>

      {platforms.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => (dragId.current = p.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => void onDrop(p.id)}
          className="rounded-3xl border border-border bg-surface p-3"
        >
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground" />
            <PlatformLogo name={p.name} logoUrl={p.logo_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.url}</p>
            </div>
            <button
              type="button"
              aria-label="Edit platform"
              onClick={() => setEditing(p)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["webview", "external"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() =>
                  toggle({ data: { code, id: p.id, open_mode: mode } }).catch(() =>
                    toast.error("Could not update"),
                  )
                }
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-colors ${
                  (p.open_mode ?? "webview") === mode
                    ? "bg-primary/15 text-primary"
                    : "bg-surface-2 text-muted-foreground"
                }`}
              >
                {mode === "webview" ? (
                  <>
                    <Monitor className="h-3.5 w-3.5" /> WebView
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-3.5 w-3.5" /> External browser
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                toggle({ data: { code, id: p.id, visible: !p.visible } }).catch(() =>
                  toast.error("Could not update"),
                )
              }
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-colors ${
                p.visible ? "bg-primary/12 text-primary" : "bg-surface-2 text-muted-foreground"
              }`}
            >
              {p.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {p.visible ? "Visible" : "Hidden"}
            </button>
            <button
              type="button"
              onClick={() =>
                toggle({ data: { code, id: p.id, maintenance: !p.maintenance } }).catch(() =>
                  toast.error("Could not update"),
                )
              }
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-colors ${
                p.maintenance
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-surface-2 text-muted-foreground"
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              {p.maintenance ? "In maintenance" : "Maintenance"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Remove ${p.name}?`)) return;
                remove({ data: { code, id: p.id } })
                  .then(() => toast.success("Removed"))
                  .catch(() => toast.error("Could not remove"));
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-destructive/15 px-2 py-2.5 text-[11px] font-semibold text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ))}


      {editing && (
        <PlatformForm
          code={code}
          platform={editing === "new" ? null : editing}
          onDone={() => setEditing(null)}
          save={save}
        />
      )}
    </div>
  );
}

function PlatformForm({
  code,
  platform,
  onDone,
  save,
}: {
  code: string;
  platform: Platform | null;
  onDone: () => void;
  save: ReturnType<typeof useServerFn<typeof savePlatform>>;
}) {
  const [name, setName] = useState(platform?.name ?? "");
  const [url, setUrl] = useState(platform?.url ?? "");
  const [logo, setLogo] = useState<string | null>(platform?.logo_url ?? null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        data: {
          code,
          ...(platform ? { id: platform.id } : {}),
          name,
          url,
          logo_url: logo,
          visible: platform?.visible ?? true,
          maintenance: platform?.maintenance ?? false,

        },
      });
      toast.success(platform ? "Platform updated" : "Platform added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={submit}
        className="glass-panel animate-rise w-full max-w-md space-y-3 rounded-3xl p-5"
      >
        <h2 className="font-display text-lg font-bold">
          {platform ? "Edit platform" : "New platform"}
        </h2>
        <input
          className={input}
          value={name}
          maxLength={80}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Platform name"
        />
        <input
          className={input}
          value={url}
          maxLength={2000}
          required
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <ImagePicker label="Platform logo" value={logo} onChange={setLogo} />
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onDone} className={`${ghostBtn} flex-1`}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={`${btn} flex-1`}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover"
          />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-dashed border-border text-muted-foreground">
            <Upload className="h-5 w-5" />
          </div>
        )}
        <label
          className={`${ghostBtn} flex flex-1 cursor-pointer items-center justify-center gap-2 text-center`}
        >
          <Upload className="h-4 w-4" />
          {busy ? "Processing…" : value ? "Change image" : "Upload from device"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                onChange(await fileToCompressedDataUrl(file));
                toast.success("Image ready — remember to save");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not read image");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="shrink-0 text-xs text-destructive hover:underline"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}


function AppearanceTab({
  code,
  settings,
}: {
  code: string;
  settings: ReturnType<typeof useSiteContent>["settings"];
}) {
  const save = useServerFn(saveSettings);
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const key = useMemo(() => settings?.updated_at ?? "", [settings]) as string;

  useEffect(() => {
    setForm(settings);
  }, [key, settings]);

  if (!form) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm({ ...form, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        data: {
          code,
          brand_name: form.brand_name,
          welcome_title: form.welcome_title,
          welcome_subtitle: form.welcome_subtitle,
          welcome_button: form.welcome_button,
          home_title: form.home_title,
          home_subtitle: form.home_subtitle,
          mascot_url: form.mascot_url,
          banner_url: form.banner_url,
          accent_color: form.accent_color,
        },
      });
      toast.success("Saved — live for everyone");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<[keyof typeof form, string]> = [
    ["brand_name", "Brand name"],
    ["welcome_title", "Welcome screen title"],
    ["welcome_subtitle", "Welcome screen subtitle"],
    ["welcome_button", "Welcome button text"],
    ["home_title", "Home title"],
    ["home_subtitle", "Home subtitle"],
    ["accent_color", "Accent color"],
  ];

  return (
    <form onSubmit={submit} className="glass-panel space-y-4 rounded-3xl p-5">
      {fields.map(([k, label]) => (
        <label key={String(k)} className="block space-y-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
          <input
            className={input}
            value={String((form as Record<string, unknown>)[String(k)] ?? "")}
            onChange={(e) => set(k, e.target.value as never)}
          />
        </label>
      ))}
      <ImagePicker
        label="Mascot image"
        value={form.mascot_url}
        onChange={(v) => set("mascot_url", v)}
      />
      <ImagePicker
        label="Home banner"
        value={form.banner_url}
        onChange={(v) => set("banner_url", v)}
      />
      <button type="submit" disabled={saving} className={`${btn} w-full`}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
