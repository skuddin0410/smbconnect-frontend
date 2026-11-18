import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BusinessMark from "@/components/BusinessMark";
import ListingRow from "@/components/ListingRow";
import { getListing, getRelated, getSectors } from "@/lib/data";
import {
  DAYS, cleanUrl, displayHost, fixMojibake, placeLine, prettyPhone, prettyTime, provinceName, safeDescription, telHref,
} from "@/lib/format";
import { SITE_URL } from "@/lib/supabase";

export const revalidate = 3600;
export async function generateStaticParams() {
  return []; // pages are built on first visit, then cached
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListing(decodeURIComponent(slug));
  if (!l) return { title: "Business not found" };
  const place = placeLine(l.city, l.province);
  const desc = fixMojibake(l.tagline || l.excerpt) || `${l.title}${place ? ` in ${place}` : ""} on SMB Connect.`;
  return {
    title: place ? `${l.title} – ${place}` : l.title,
    description: desc.slice(0, 160),
    alternates: { canonical: `/listing/${l.slug}/` },
    openGraph: { title: l.title, description: desc.slice(0, 200), images: l.image_url ? [l.image_url] : undefined },
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", twitter: "X (Twitter)", youtube: "YouTube", whatsapp: "WhatsApp",
};

export default async function ListingPage({ params }: { params: Params }) {
  const { slug } = await params;
  const l = await getListing(decodeURIComponent(slug));
  if (!l) notFound();
  const [sectors, related] = await Promise.all([getSectors(), getRelated(l.sector, l.province, l.id)]);
  const sector = sectors.find((s) => s.slug === l.sector);
  const sectorName = new Map(sectors.map((s) => [s.slug, s.name]));
  const website = cleanUrl(l.website);
  const host = displayHost(l.website);
  const tel = telHref(l.phone);
  const place = placeLine(l.city, l.province);
  const description = safeDescription(fixMojibake(l.description_html));
  const socials = Object.entries(l.socials ?? {})
    .map(([k, v]) => [k, k === "whatsapp" ? `https://wa.me/${String(v).replace(/\D/g, "")}` : cleanUrl(v)] as const)
    .filter(([, v]) => v);
  const hours = l.business_hours
    ? DAYS.map((d) => {
        const h = l.business_hours![d];
        if (!h) return [d, "Closed"] as const;
        if (typeof h === "string") return [d, h] as const;
        return [d, h.open && h.close ? `${prettyTime(h.open)} – ${prettyTime(h.close)}` : "Open"] as const;
      })
    : null;
  const gallery = (l.gallery ?? []).filter((g) => g && g !== l.logo_url);
  const heroImage = l.image_url && l.image_url !== l.logo_url ? l.image_url : null;
  const mapHref = l.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: l.title,
    url: `${SITE_URL}/listing/${l.slug}/`,
    ...(website && { sameAs: [website, ...socials.map(([, v]) => v)] }),
    ...(l.phone && { telephone: l.phone }),
    ...(l.excerpt && { description: l.excerpt }),
    ...((l.logo_url || l.image_url) && { image: l.logo_url || l.image_url }),
    ...((l.address || l.city || l.province) && {
      address: {
        "@type": "PostalAddress",
        ...(l.address && { streetAddress: l.address }),
        ...(l.city && { addressLocality: l.city }),
        ...(l.province && { addressRegion: l.province }),
        addressCountry: "CA",
      },
    }),
    ...(l.latitude && l.longitude && { geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } }),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="bg-mist">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-6">
          <nav aria-label="Breadcrumb" className="text-[0.92rem] text-muted">
            <ol className="flex flex-wrap gap-x-2">
              <li><Link href="/businesses/" className="hover:underline">Businesses</Link> /</li>
              {sector && <li><Link href={`/industry/${sector.slug}/`} className="hover:underline">{sector.name}</Link> /</li>}
              <li aria-current="page" className="text-ink">{l.title}</li>
            </ol>
          </nav>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <BusinessMark id={l.id} title={l.title} logo={l.logo_url ?? l.image_url} size={96} />
            <div className="min-w-0">
              <h1 className="display-soft text-[2rem] text-navy sm:text-[2.6rem]">{l.title}</h1>
              {l.tagline && <p className="mt-1 text-lg text-ink/80">{fixMojibake(l.tagline)}</p>}
              <p className="mt-2 text-muted">
                {sector && (
                  <Link href={`/industry/${sector.slug}/`} className="font-semibold text-blue hover:underline">{sector.name}</Link>
                )}
                {sector && place && " in "}
                {place && (l.province ? (
                  <Link href={`/province/${l.province.toLowerCase()}/`} className="hover:underline">{place}</Link>
                ) : place)}
              </p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {website && (
              <a href={website} rel="nofollow noopener" target="_blank" className="rounded-md bg-navy px-5 py-3 font-semibold text-white hover:bg-navy-2">
                Visit website
              </a>
            )}
            {tel && (
              <a href={tel} className="rounded-md border border-navy bg-white px-5 py-3 font-semibold text-navy hover:bg-sky">
                Call {prettyPhone(l.phone)}
              </a>
            )}
            {l.email && (
              <a href={`mailto:${l.email}`} className="rounded-md border border-navy bg-white px-5 py-3 font-semibold text-navy hover:bg-sky">
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-12 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt={`${l.title}`} className="mb-10 max-h-[26rem] w-full rounded-xl object-cover" />
          )}
          <h2 className="display-soft text-[1.5rem] text-navy">About {l.title}</h2>
          {description ? (
            <div className="prose-listing mt-4 max-w-[70ch] text-[1.06rem]" dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="mt-4 max-w-[70ch] text-muted">
              This business hasn’t added a description yet.{" "}
              <Link href={`/submit-listing/?type=claim&listing=${l.slug}`} className="text-blue underline">Is this your business?</Link>
            </p>
          )}

          {gallery.length > 0 && (
            <section aria-labelledby="gallery-h" className="mt-12">
              <h2 id="gallery-h" className="display-soft text-[1.5rem] text-navy">Photos</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.slice(0, 9).map((g, i) => (
                  <li key={g}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g} alt={`${l.title} photo ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {l.tags?.length > 0 && (
            <section aria-labelledby="tags-h" className="mt-12">
              <h2 id="tags-h" className="font-bold text-navy">Services and keywords</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {l.tags.slice(0, 20).map((t) => (
                  <li key={t}>
                    <Link href={`/businesses/?q=${encodeURIComponent(t)}`} className="inline-block rounded-full bg-mist px-3 py-1 text-[0.92rem] hover:bg-sky">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="contact-h" className="rounded-xl border border-line p-6">
            <h2 id="contact-h" className="font-bold text-navy">Contact details</h2>
            <dl className="mt-4 space-y-4 text-[0.98rem]">
              {website && (
                <div>
                  <dt className="text-sm text-muted">Website</dt>
                  <dd><a href={website} rel="nofollow noopener" target="_blank" className="break-all text-blue underline">{host}</a></dd>
                </div>
              )}
              {l.phone && (
                <div>
                  <dt className="text-sm text-muted">Phone</dt>
                  <dd>{tel ? <a href={tel} className="text-blue underline">{prettyPhone(l.phone)}</a> : l.phone}</dd>
                </div>
              )}
              {l.email && (
                <div>
                  <dt className="text-sm text-muted">Email</dt>
                  <dd><a href={`mailto:${l.email}`} className="break-all text-blue underline">{l.email}</a></dd>
                </div>
              )}
              {(l.address || place) && (
                <div>
                  <dt className="text-sm text-muted">Location</dt>
                  <dd>
                    {l.address ?? `${l.city ? `${l.city}, ` : ""}${provinceName(l.province) ?? ""}`}
                    {mapHref && (
                      <a href={mapHref} target="_blank" rel="noopener" className="mt-1 block text-blue underline">Open in Google Maps</a>
                    )}
                  </dd>
                </div>
              )}
            </dl>
            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                {socials.map(([k, v]) => (
                  <li key={k}>
                    <a href={v!} rel="nofollow noopener" target="_blank" className="inline-block rounded-md bg-mist px-3 py-1.5 text-[0.92rem] font-medium hover:bg-sky">
                      {SOCIAL_LABELS[k] ?? k}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {hours && (
            <section aria-labelledby="hours-h" className="rounded-xl border border-line p-6">
              <h2 id="hours-h" className="font-bold text-navy">Business hours</h2>
              <table className="mt-3 w-full text-[0.95rem]">
                <tbody>
                  {hours.map(([d, h]) => (
                    <tr key={d} className="border-b border-line last:border-0">
                      <th scope="row" className="py-1.5 text-left font-medium">{d}</th>
                      <td className="py-1.5 text-right text-muted">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="rounded-xl bg-navy p-6 text-white">
            <h2 className="font-bold">{l.claimed ? "Is something out of date?" : "Is this your business?"}</h2>
            <p className="mt-2 text-[0.95rem] text-white/80">
              {l.claimed
                ? "Send us a correction and we’ll update this page."
                : "Claim this listing to update your details, logo and description. It’s free."}
            </p>
            <Link
              href={`/submit-listing/?type=claim&listing=${l.slug}`}
              className="mt-4 inline-block rounded-md bg-amber px-4 py-2.5 font-bold text-navy hover:bg-[#f0b552]"
            >
              {l.claimed ? "Suggest an update" : "Claim this listing"}
            </Link>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-h" className="mx-auto max-w-6xl px-5 pt-16">
          <h2 id="related-h" className="display-soft text-[1.6rem] text-navy">
            More {sector ? sector.name.toLowerCase() : "businesses"}{l.province ? ` in ${provinceName(l.province)}` : ""}
          </h2>
          <ul className="mt-2 grid gap-x-12 md:grid-cols-2">
            {related.map((r) => (
              <ListingRow key={r.id} l={r} sectorName={r.sector ? sectorName.get(r.sector) : undefined} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
