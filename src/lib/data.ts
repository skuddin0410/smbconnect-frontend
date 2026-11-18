import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import type { Listing, ListingSummary, Province, Sector } from "./types";

const SUMMARY =
  "id,slug,title,tagline,excerpt,city,province,sector,logo_url,image_url,website,phone,claimed";
export const PAGE_SIZE = 24;
const HOUR = 3600;

export const getSectors = unstable_cache(
  async (): Promise<Sector[]> => {
    const { data, error } = await supabase.from("sectors").select("*").order("sort");
    if (error) throw error;
    return data ?? [];
  },
  ["sectors"],
  { revalidate: HOUR, tags: ["taxonomy"] },
);

export const getProvinces = unstable_cache(
  async (): Promise<Province[]> => {
    const { data, error } = await supabase.from("provinces").select("*").order("sort");
    if (error) throw error;
    return data ?? [];
  },
  ["provinces"],
  { revalidate: HOUR, tags: ["taxonomy"] },
);

export const getTotalListings = unstable_cache(
  async (): Promise<number> => {
    const { count } = await supabase.from("listings").select("id", { count: "exact", head: true });
    return count ?? 0;
  },
  ["listing-total"],
  { revalidate: HOUR, tags: ["listings"] },
);

export const getRecentListings = unstable_cache(
  async (limit = 8): Promise<ListingSummary[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select(SUMMARY)
      .not("excerpt", "is", null)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },
  ["recent-listings"],
  { revalidate: HOUR, tags: ["listings"] },
);

export const getListing = unstable_cache(
  async (slug: string): Promise<Listing | null> => {
    const { data, error } = await supabase.from("listings").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  },
  ["listing"],
  { revalidate: HOUR, tags: ["listings"] },
);

export const getRelated = unstable_cache(
  async (sector: string | null, province: string | null, excludeId: number): Promise<ListingSummary[]> => {
    let q = supabase.from("listings").select(SUMMARY).neq("id", excludeId).not("excerpt", "is", null).limit(4);
    if (sector) q = q.eq("sector", sector);
    if (province) q = q.eq("province", province);
    const { data } = await q;
    return data ?? [];
  },
  ["related"],
  { revalidate: HOUR, tags: ["listings"] },
);

export const getLegacyCategory = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase.from("categories").select("id,name,slug").eq("slug", slug).maybeSingle();
    return data;
  },
  ["legacy-category"],
  { revalidate: HOUR },
);

export const getLegacyLocation = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase.from("locations").select("id,name,slug").eq("slug", slug).maybeSingle();
    return data;
  },
  ["legacy-location"],
  { revalidate: HOUR },
);

export type DirectoryQuery = {
  q?: string;
  sector?: string;
  province?: string;
  categoryId?: number;
  locationId?: number;
  page?: number;
};

/** Removes characters that would break PostgREST filter syntax. */
function cleanTerm(q: string) {
  return q.replace(/[,()*:%\\'"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export const searchListings = unstable_cache(
  async (query: DirectoryQuery): Promise<{ rows: ListingSummary[]; total: number }> => {
    const page = Math.max(1, query.page ?? 1);
    const from = (page - 1) * PAGE_SIZE;
    const select =
      query.categoryId !== undefined
        ? `${SUMMARY},listing_categories!inner(category_id)`
        : query.locationId !== undefined
          ? `${SUMMARY},listing_locations!inner(location_id)`
          : SUMMARY;

    let q = supabase.from("listings").select(select, { count: "exact" });
    const term = query.q ? cleanTerm(query.q) : "";
    if (term) q = q.or(`search.wfts(english).${term},title.ilike.*${term}*`);
    if (query.sector) q = q.eq("sector", query.sector);
    if (query.province) q = q.eq("province", query.province);
    if (query.categoryId !== undefined) q = q.eq("listing_categories.category_id", query.categoryId);
    if (query.locationId !== undefined) q = q.eq("listing_locations.location_id", query.locationId);

    q = q
      .order("title", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    const { data, count, error } = await q;
    if (error) throw error;
    const rows = (data ?? []).map((r) => {
      const { listing_categories: _c, listing_locations: _l, ...rest } = r as unknown as ListingSummary & {
        listing_categories?: unknown;
        listing_locations?: unknown;
      };
      void _c;
      void _l;
      return rest as ListingSummary;
    });
    return { rows, total: count ?? 0 };
  },
  ["search-listings"],
  { revalidate: HOUR, tags: ["listings"] },
);

export const getAllSlugs = unstable_cache(
  async (): Promise<{ slug: string; updated_at: string }[]> => {
    const out: { slug: string; updated_at: string }[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from("listings")
        .select("slug,updated_at")
        .order("id")
        .range(from, from + 999);
      if (error) throw error;
      out.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    return out;
  },
  ["all-slugs"],
  { revalidate: HOUR * 6, tags: ["listings"] },
);
