import Link from "next/link";
import ListingRow from "./ListingRow";
import { PAGE_SIZE, getProvinces, getSectors, searchListings, type DirectoryQuery } from "@/lib/data";

type Props = {
  heading: string;
  intro?: string;
  query: DirectoryQuery;
  /** Base path used for pagination and filters, e.g. "/businesses/" or "/industry/legal/". */
  basePath: string;
  /** Filters fixed by the route, which the sidebar should not override. */
  fixed?: { sector?: string; province?: string };
};

function href(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && v !== 1) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export default async function Directory({ heading, intro, query, basePath, fixed = {} }: Props) {
  const [{ rows, total }, sectors, provinces] = await Promise.all([
    searchListings(query),
    getSectors(),
    getProvinces(),
  ]);
  const page = query.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const sectorName = new Map(sectors.map((s) => [s.slug, s.name]));

  // Filters keep each other's values; the route's fixed filter is part of basePath.
  const current = { q: query.q, sector: fixed.sector ? undefined : query.sector, province: fixed.province ? undefined : query.province };
  const filterLink = (patch: Record<string, string | undefined>) =>
    href(fixed.sector || fixed.province ? basePath : "/businesses/", { ...current, ...patch });

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <div className="max-w-3xl">
        <h1 className="display text-[2.2rem] text-navy sm:text-[2.8rem]">{heading}</h1>
        {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
      </div>

      <form action={basePath} method="get" role="search" className="mt-7 flex max-w-3xl gap-2">
        <label htmlFor="dir-q" className="sr-only">Search businesses</label>
        <input
          id="dir-q"
          name="q"
          defaultValue={query.q ?? ""}
          placeholder="Business name or service, e.g. bookkeeping"
          className="min-w-0 flex-1 rounded-md border border-line bg-white px-4 py-3 text-base outline-none focus:border-blue focus:ring-2 focus:ring-sky"
        />
        {!fixed.sector && query.sector && <input type="hidden" name="sector" value={query.sector} />}
        {!fixed.province && query.province && <input type="hidden" name="province" value={query.province} />}
        <button className="rounded-md bg-navy px-5 py-3 font-semibold text-white hover:bg-navy-2">Search</button>
      </form>

      <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="space-y-8 text-[0.95rem]">
          {!fixed.sector && (
            <div>
              <h2 className="font-bold text-navy">Industry</h2>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link
                    href={filterLink({ sector: undefined })}
                    aria-current={!query.sector ? "true" : undefined}
                    className="flex justify-between rounded px-2 py-1 hover:bg-mist aria-[current]:bg-sky aria-[current]:font-semibold"
                  >
                    All industries
                  </Link>
                </li>
                {sectors.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={filterLink({ sector: s.slug })}
                      aria-current={query.sector === s.slug ? "true" : undefined}
                      className="flex justify-between gap-3 rounded px-2 py-1 hover:bg-mist aria-[current]:bg-sky aria-[current]:font-semibold"
                    >
                      <span>{s.name}</span>
                      <span className="tabular-nums text-muted">{s.listing_count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!fixed.province && (
            <div>
              <h2 className="font-bold text-navy">Province</h2>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link
                    href={filterLink({ province: undefined })}
                    aria-current={!query.province ? "true" : undefined}
                    className="flex justify-between rounded px-2 py-1 hover:bg-mist aria-[current]:bg-sky aria-[current]:font-semibold"
                  >
                    All of Canada
                  </Link>
                </li>
                {provinces
                  .filter((p) => p.listing_count > 0)
                  .map((p) => (
                    <li key={p.code}>
                      <Link
                        href={filterLink({ province: p.code })}
                        aria-current={query.province === p.code ? "true" : undefined}
                        className="flex justify-between gap-3 rounded px-2 py-1 hover:bg-mist aria-[current]:bg-sky aria-[current]:font-semibold"
                      >
                        <span>{p.name}</span>
                        <span className="tabular-nums text-muted">{p.listing_count}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </aside>

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-[0.98rem] text-muted" aria-live="polite">
            {total === 0
              ? "No businesses match these filters."
              : `${total.toLocaleString("en-CA")} ${total === 1 ? "business" : "businesses"}${
                  pages > 1 ? `, page ${page} of ${pages}` : ""
                }`}
          </h2>

          {total === 0 ? (
            <div className="mt-6 rounded-lg bg-mist p-6">
              <p className="font-semibold text-navy">Try a broader search.</p>
              <p className="mt-1 text-muted">
                Remove a filter or use a shorter word, such as “accounting” instead of “accounting firm”.
              </p>
              <p className="mt-4">
                <Link href="/businesses/" className="font-semibold text-blue underline">Clear all filters</Link>
              </p>
            </div>
          ) : (
            <ul className="mt-2">
              {rows.map((l) => (
                <ListingRow key={l.id} l={l} sectorName={l.sector ? sectorName.get(l.sector) : undefined} />
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
              {page > 1 ? (
                <Link className="rounded-md border border-line px-4 py-2 font-semibold hover:bg-mist" href={href(basePath, { ...current, page: page - 1 })}>
                  Previous page
                </Link>
              ) : <span />}
              <span className="text-sm text-muted">Page {page} of {pages}</span>
              {page < pages ? (
                <Link className="rounded-md border border-line px-4 py-2 font-semibold hover:bg-mist" href={href(basePath, { ...current, page: page + 1 })}>
                  Next page
                </Link>
              ) : <span />}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
