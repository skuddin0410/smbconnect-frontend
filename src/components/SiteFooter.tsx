import Link from "next/link";
import Logo from "./Logo";

const NETWORK = [
  { href: "https://canadiansme.ca/", label: "CanadianSME Small Business Magazine" },
  { href: "https://www.smeawards.ca/", label: "CanadianSME Small Business Awards" },
  { href: "https://www.smeexpo.ca/", label: "SME Expo" },
  { href: "https://smbpodcast.ca/", label: "Small Business Podcast" },
  { href: "https://www.smallbusinesstalks.ca/", label: "Small Business Talks" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-[0.98rem] text-white/75">
            A free directory of Canadian small and medium-sized businesses, run by CanadianSME Small
            Business Magazine.
          </p>
        </div>
        <nav aria-label="Directory">
          <h2 className="font-semibold">Directory</h2>
          <ul className="mt-4 space-y-2 text-white/80">
            <li><Link className="hover:text-white hover:underline" href="/businesses/">Find businesses</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/submit-listing/">List your business</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/submit-listing/?type=claim">Claim a listing</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/about-us/">About</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/contact/">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="CanadianSME network">
          <h2 className="font-semibold">CanadianSME network</h2>
          <ul className="mt-4 space-y-2 text-white/80">
            {NETWORK.map((n) => (
              <li key={n.href}>
                <a className="hover:text-white hover:underline" href={n.href} rel="noopener">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm text-white/60">
          © {new Date().getFullYear()} CanadianSME Small Business Magazine. Listings are provided by the
          businesses themselves.
        </p>
      </div>
    </footer>
  );
}
