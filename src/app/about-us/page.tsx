import type { Metadata } from "next";
import Link from "next/link";
import { getTotalListings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About SMB Connect",
  description: "SMB Connect is a free directory of Canadian small and medium-sized businesses, run by CanadianSME Small Business Magazine.",
  alternates: { canonical: "/about-us/" },
};
export const revalidate = 3600;

export default async function AboutPage() {
  const total = await getTotalListings();
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12">
      <h1 className="display text-[2.2rem] text-navy sm:text-[2.8rem]">About SMB Connect</h1>
      <div className="mt-6 space-y-5 text-[1.1rem] leading-relaxed">
        <p>
          SMB Connect helps Canadian businesses find each other. It lists {total.toLocaleString("en-CA")} small and
          medium-sized businesses, from accountants and agencies to software firms and trades, so owners can find
          partners and suppliers close to home.
        </p>
        <p>
          The directory is run by <a href="https://canadiansme.ca/" className="text-blue underline">CanadianSME Small Business Magazine</a>,
          which also organises the CanadianSME Small Business Awards and SME Expo. Listing a business is free.
        </p>
        <p>
          Every new listing is reviewed by our team before it’s published. If you spot something out of date,
          use the “Suggest an update” button on that business’s page.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/businesses/" className="rounded-md bg-navy px-5 py-3 font-semibold text-white hover:bg-navy-2">Find businesses</Link>
        <Link href="/submit-listing/" className="rounded-md border border-navy px-5 py-3 font-semibold text-navy hover:bg-mist">List your business</Link>
      </div>
    </div>
  );
}
