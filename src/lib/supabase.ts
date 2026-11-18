import { createClient } from "@supabase/supabase-js";

// The publishable key only allows what Row Level Security permits:
// reading published listings and inserting submissions.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pmaxnkvdwwvpnsqsyzqi.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_4PKlJB2wlg0QyqtP95CraQ_jImuIocp";

// SMB_FIXTURE=1 serves a small local sample (dev/fixture.json) for offline previews.
const fixtureFetch: typeof fetch | undefined =
  process.env.SMB_FIXTURE === "1"
    ? async (input) => {
        const fx = (await import("../../dev/fixture.json")).default as Record<string, unknown> & {
          listings: Record<string, unknown>[];
          full: Record<string, unknown>;
        };
        const u = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
        const table = u.pathname.split("/").pop() ?? "";
        const sel = u.searchParams.get("select") ?? "";
        let body: unknown = [];
        if (table === "sectors" || table === "provinces") body = fx[table];
        else if (table === "listings" && u.searchParams.get("slug")) body = u.searchParams.get("slug") === `eq.${fx.full.slug}` ? fx.full : null;
        else if (table === "listings" && sel === "*") body = fx.full;
        else if (table === "listings") body = fx.listings;
        else if (table === "categories" || table === "locations") body = null;
        const n = Array.isArray(body) ? body.length : 1;
        return new Response(body === null ? "null" : JSON.stringify(body), {
          status: 200,
          headers: { "content-type": "application/json", "content-range": `0-${n - 1}/${table === "listings" ? 2605 : n}` },
        });
      }
    : undefined;

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: fixtureFetch ? { fetch: fixtureFetch } : undefined,
});

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.smbconnect.ca").replace(/\/$/, "");
