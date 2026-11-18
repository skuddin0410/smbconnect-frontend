import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-20">
      <h1 className="display text-[2.4rem] text-navy">We couldn’t find that page</h1>
      <p className="mt-4 text-lg text-muted">
        The business may have moved or been removed. Search the directory to find it.
      </p>
      <form action="/businesses/" method="get" role="search" className="mt-8 flex max-w-xl gap-2">
        <label htmlFor="nf-q" className="sr-only">Search businesses</label>
        <input id="nf-q" name="q" placeholder="Business name or service" className="min-w-0 flex-1 rounded-md border border-line px-4 py-3" />
        <button className="rounded-md bg-navy px-5 py-3 font-semibold text-white">Search</button>
      </form>
      <p className="mt-6"><Link href="/" className="text-blue underline">Go to the homepage</Link></p>
    </div>
  );
}
