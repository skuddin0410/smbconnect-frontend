import Link from "next/link";
import BusinessMark from "./BusinessMark";
import { displayHost, fixMojibake, placeLine } from "@/lib/format";
import type { ListingSummary } from "@/lib/types";

export default function ListingRow({ l, sectorName }: { l: ListingSummary; sectorName?: string }) {
  const place = placeLine(l.city, l.province);
  const host = displayHost(l.website);
  return (
    <li className="group relative flex gap-4 border-b border-line py-5 last:border-b-0">
      <BusinessMark id={l.id} title={l.title} logo={l.logo_url ?? l.image_url} />
      <div className="min-w-0 flex-1">
        <h3 className="text-[1.12rem] font-bold leading-snug text-navy">
          <Link href={`/listing/${l.slug}/`} className="after:absolute after:inset-0 group-hover:underline">
            {l.title}
          </Link>
        </h3>
        <p className="mt-0.5 text-[0.93rem] text-muted">
          {sectorName && place ? `${sectorName} in ${place}` : sectorName || place}
          {host && <span className="ml-3 hidden text-blue sm:inline">{host}</span>}
        </p>
        {(l.tagline || l.excerpt) && (
          <p className="mt-1.5 line-clamp-2 max-w-[68ch] text-[0.98rem] text-ink/85">
            {fixMojibake(l.tagline || l.excerpt)}
          </p>
        )}
      </div>
    </li>
  );
}
