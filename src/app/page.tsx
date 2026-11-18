import Link from "next/link";
import ListingRow from "@/components/ListingRow";
import { getProvinces, getRecentListings, getSectors, getTotalListings } from "@/lib/data";

export const revalidate = 3600;

export default async function Home() {
  const [sectors, provinces, total, recent] = await Promise.all([
    getSectors(),
    getProvinces(),
    getTotalListings(),
    getRecentListings(8),
  ]);
  const sectorName = new Map(sectors.map((s) => [s.slug, s.name]));
  const listedSectors = sectors.filter((s) => s.slug !== "other");

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <form action="/businesses/" method="get" role="search" className="reveal max-w-5xl">
            <h1 className="sr-only">Find a Canadian small business</h1>
            <p className="display text-[2.15rem] sm:text-[3.4rem] lg:text-[4.1rem]">
              I’m looking for{" "}
              <label htmlFor="hero-q" className="sr-only">What kind of business</label>
              <input
                id="hero-q"
                name="q"
                placeholder="a bookkeeper"
                autoComplete="off"
                className="blank w-[8.5em]"
              />{" "}
              in{" "}
              <label htmlFor="hero-province" className="sr-only">Province</label>
              <select id="hero-province" name="province" className="blank" defaultValue="">
                <option value="">all of Canada</option>
                {provinces
                  .filter((p) => p.listing_count > 0)
                  .map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </p>
            <div className="reveal reveal-2 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button className="rounded-md bg-amber px-7 py-3.5 text-lg font-bold text-navy hover:bg-[#f0b552]">
                Find businesses
              </button>
              <p className="text-white/75">
                {total.toLocaleString("en-CA")} Canadian businesses, free to search.
              </p>
            </div>
          </form>
          <div className="reveal reveal-3 mt-12 flex flex-wrap gap-2.5 text-[0.95rem]">
            <span className="sr-only">Popular searches:</span>
            {listedSectors.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/industry/${s.slug}/`}
                className="rounded-full border border-white/30 px-3.5 py-1.5 text-white/90 hover:border-white hover:text-white"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="sectors" aria-labelledby="sectors-h" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="sectors-h" className="display-soft text-[1.9rem] text-navy sm:text-[2.3rem]">
            Browse by industry
          </h2>
          <Link href="/businesses/" className="font-semibold text-blue hover:underline">
            See every business
          </Link>
        </div>
        <ul className="mt-8 grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
          {sectors.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/industry/${s.slug}/`} className="group flex items-baseline justify-between gap-6 py-4">
                <span>
                  <span className="block text-[1.12rem] font-bold text-navy group-hover:underline">{s.name}</span>
                  {s.blurb && <span className="block text-[0.95rem] text-muted">{s.blurb}</span>}
                </span>
                <span className="tabular-nums text-[1.05rem] font-semibold text-blue">{s.listing_count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="provinces" aria-labelledby="prov-h" className="mt-20 scroll-mt-6 bg-mist">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 id="prov-h" className="display-soft text-[1.9rem] text-navy sm:text-[2.3rem]">
            Browse by province
          </h2>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {provinces.map((p) => (
              <li key={p.code} className="border-b border-line">
                {p.listing_count > 0 ? (
                  <Link href={`/province/${p.code.toLowerCase()}/`} className="group flex justify-between gap-4 py-3.5">
                    <span className="font-semibold text-navy group-hover:underline">{p.name}</span>
                    <span className="tabular-nums text-muted">{p.listing_count.toLocaleString("en-CA")}</span>
                  </Link>
                ) : (
                  <span className="flex justify-between gap-4 py-3.5 text-muted">
                    <span>{p.name}</span>
                    <Link href="/submit-listing/" className="text-[0.92rem] text-blue hover:underline">
                      Be the first
                    </Link>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="recent-h" className="mx-auto max-w-6xl px-5 pt-20">
        <h2 id="recent-h" className="display-soft text-[1.9rem] text-navy sm:text-[2.3rem]">
          Recently listed
        </h2>
        <ul className="mt-4 grid gap-x-12 md:grid-cols-2">
          {recent.map((l) => (
            <ListingRow key={l.id} l={l} sectorName={l.sector ? sectorName.get(l.sector) : undefined} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="list-h" className="mx-auto mt-20 max-w-6xl px-5">
        <div className="grid gap-10 rounded-2xl border-2 border-navy p-8 sm:p-12 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <h2 id="list-h" className="display-soft text-[1.9rem] text-navy sm:text-[2.3rem]">
              Get your business in front of Canadian buyers
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Listing is free. Tell us about your business and the CanadianSME team will publish it,
              usually within two business days. Already listed? Claim your page to update it.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/submit-listing/" className="rounded-md bg-navy px-6 py-3.5 text-center text-lg font-bold text-white hover:bg-navy-2">
              List your business
            </Link>
            <Link href="/submit-listing/?type=claim" className="rounded-md border border-navy px-6 py-3.5 text-center text-lg font-semibold text-navy hover:bg-mist">
              Claim an existing listing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
