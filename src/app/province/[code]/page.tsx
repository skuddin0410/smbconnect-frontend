import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Directory from "@/components/Directory";
import { getProvinces, getSectors } from "@/lib/data";

type Params = Promise<{ code: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateStaticParams() {
  return (await getProvinces()).filter((p) => p.listing_count > 0).map((p) => ({ code: p.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { code } = await params;
  const p = (await getProvinces()).find((x) => x.code === code.toUpperCase());
  if (!p) return {};
  return {
    title: `Small businesses in ${p.name}`,
    description: `Browse ${p.listing_count} small and medium-sized businesses in ${p.name} on SMB Connect.`,
    alternates: { canonical: `/province/${p.code.toLowerCase()}/` },
  };
}

export default async function ProvincePage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { code } = await params;
  const sp = await searchParams;
  const [sectors, provinces] = await Promise.all([getSectors(), getProvinces()]);
  const p = provinces.find((x) => x.code === code.toUpperCase());
  if (!p) notFound();
  const sector = sectors.some((s) => s.slug === one(sp.sector)) ? one(sp.sector) : undefined;
  const sName = sector ? sectors.find((s) => s.slug === sector)!.name : null;
  return (
    <Directory
      heading={sName ? `${sName} in ${p.name}` : `Businesses in ${p.name}`}
      query={{ province: p.code, sector, q: one(sp.q)?.trim() || undefined, page: Number(one(sp.page)) || 1 }}
      basePath={`/province/${p.code.toLowerCase()}/`}
      fixed={{ province: p.code }}
    />
  );
}
