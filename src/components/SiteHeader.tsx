import Link from "next/link";
import Logo from "./Logo";

const NAV = [
  { href: "/businesses/", label: "Find businesses" },
  { href: "/#sectors", label: "Industries" },
  { href: "/#provinces", label: "Provinces" },
  { href: "/about-us/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.98rem] font-medium text-ink">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-blue hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/submit-listing/"
          className="hidden rounded-md bg-navy px-4 py-2.5 text-[0.95rem] font-semibold text-white hover:bg-navy-2 md:inline-block"
        >
          List your business
        </Link>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-2 text-sm font-semibold">
            Menu
          </summary>
          <ul className="absolute right-0 z-40 mt-2 w-56 rounded-lg border border-line bg-white p-2 shadow-lg">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block rounded px-3 py-2 hover:bg-mist">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/submit-listing/" className="mt-1 block rounded bg-navy px-3 py-2 font-semibold text-white">
                List your business
              </Link>
            </li>
          </ul>
        </details>
      </div>
    </header>
  );
}
