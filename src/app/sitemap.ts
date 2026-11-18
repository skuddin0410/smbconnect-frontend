import type { MetadataRoute } from "next";
import { getAllSlugs, getProvinces, getSectors } from "@/lib/data";
import { SITE_URL } from "@/lib/supabase";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, sectors, provinces] = await Promise.all([getAllSlugs(), getSectors(), getProvinces()]);
  const fixed = ["/", "/businesses/", "/submit-listing/", "/about-us/", "/contact/"].map((p) => ({ url: `${SITE_URL}${p}` }));
  return [
    ...fixed,
    ...sectors.map((s) => ({ url: `${SITE_URL}/industry/${s.slug}/` })),
    ...provinces.filter((p) => p.listing_count > 0).map((p) => ({ url: `${SITE_URL}/province/${p.code.toLowerCase()}/` })),
    ...slugs.map((s) => ({ url: `${SITE_URL}/listing/${s.slug}/`, lastModified: s.updated_at })),
  ];
}
