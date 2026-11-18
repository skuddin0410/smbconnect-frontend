import type { Metadata } from "next";
import Directory from "@/components/Directory";
import { getLegacyCategory, getLegacyLocation, getProvinces, getSectors } from "@/lib/data";

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const q = one(sp.q);
  return {
    title: q ? `“${q}” businesses in Canada` : "Find Canadian small businesses",
    description: "Search Canadian small and medium-sized businesses by name, service, industry and province.",
    alternates: { canonical: "/businesses/" },
    robots: q || one(sp.page) ? { index: false, follow: true } : undefined,
  };
}

export default async function BusinessesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q)?.trim() || undefined;
  const page = Number(one(sp.page)) || 1;
  const [sectors, provinces] = await Promise.all([getSectors(), getProvinces()]);
  const sector = sectors.some((s) => s.slug === one(sp.sector)) ? one(sp.sector) : undefined;
  const provinceRaw = one(sp.province)?.toUpperCase();
  const province = provinces.some((p) => p.code === provinceRaw) ? provinceRaw : undefined;

  // Old WordPress category / location URLs redirect here.
  const legacyCat = one(sp.category) ? await getLegacyCategory(one(sp.category)!) : null;
  const legacyLoc = one(sp.location) ? await getLegacyLocation(one(sp.location)!) : null;

  const parts: string[] = [];
  if (legacyCat) parts.push(legacyCat.name);
  else if (sector) parts.push(sectors.find((s) => s.slug === sector)!.name);
  const place = legacyLoc?.name ?? (province ? provinces.find((p) => p.code === province)!.name : null);

  const heading = q
    ? `Results for “${q}”`
    : parts.length
      ? `${parts[0]}${place ? ` in ${place}` : ""}`
      : place
        ? `Businesses in ${place}`
        : "Find a Canadian business";

  return (
    <Directory
      heading={heading}
      query={{ q, sector, province, page, categoryId: legacyCat?.id, locationId: legacyLoc?.id }}
      basePath="/businesses/"
    />
  );
}
