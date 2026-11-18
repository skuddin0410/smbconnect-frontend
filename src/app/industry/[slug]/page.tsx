import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Directory from "@/components/Directory";
import { getProvinces, getSectors } from "@/lib/data";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateStaticParams() {
  return (await getSectors()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = (await getSectors()).find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.name} businesses in Canada`,
    description: `${s.blurb ?? ""} Browse ${s.listing_count} Canadian ${s.name.toLowerCase()} businesses on SMB Connect.`.trim(),
    alternates: { canonical: `/industry/${s.slug}/` },
  };
}

export default async function IndustryPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const [sectors, provinces] = await Promise.all([getSectors(), getProvinces()]);
  const s = sectors.find((x) => x.slug === slug);
  if (!s) notFound();
  const provinceRaw = one(sp.province)?.toUpperCase();
  const province = provinces.some((p) => p.code === provinceRaw) ? provinceRaw : undefined;
  const pName = province ? provinces.find((p) => p.code === province)!.name : null;
  return (
    <Directory
      heading={pName ? `${s.name} in ${pName}` : s.name}
      intro={s.blurb ?? undefined}
      query={{ sector: s.slug, province, q: one(sp.q)?.trim() || undefined, page: Number(one(sp.page)) || 1 }}
      basePath={`/industry/${s.slug}/`}
      fixed={{ sector: s.slug }}
    />
  );
}
