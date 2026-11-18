import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import { getListing, getSectors } from "@/lib/data";

export const metadata: Metadata = {
  title: "List your business for free",
  description: "Add your Canadian small business to SMB Connect for free, or claim an existing listing to update it.",
  alternates: { canonical: "/submit-listing/" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function SubmitPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const claim = one(sp.type) === "claim";
  const listingSlug = one(sp.listing);
  const [sectors, listing] = await Promise.all([
    getSectors(),
    claim && listingSlug ? getListing(listingSlug) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12">
      <div className="grid gap-14 lg:grid-cols-[1fr_22rem]">
        <div className="max-w-2xl">
          <h1 className="display text-[2.2rem] text-navy sm:text-[2.8rem]">
            {claim ? (listing ? `Claim ${listing.title}` : "Claim your listing") : "List your business"}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {claim
              ? "Tell us who you are and we’ll confirm you own the business. Once confirmed, you can send us updates to your page at any time."
              : "It’s free. Fill in the basics and the CanadianSME team will publish your page, usually within two business days."}
          </p>

          <div role="tablist" aria-label="Request type" className="mt-8 inline-flex rounded-lg bg-mist p-1">
            <Link role="tab" aria-selected={!claim} href="/submit-listing/" className="rounded-md px-4 py-2 font-semibold aria-selected:bg-white aria-selected:text-navy aria-selected:shadow-sm">
              New listing
            </Link>
            <Link role="tab" aria-selected={claim} href="/submit-listing/?type=claim" className="rounded-md px-4 py-2 font-semibold aria-selected:bg-white aria-selected:text-navy aria-selected:shadow-sm">
              Claim a listing
            </Link>
          </div>

          <div className="mt-8">
            <EnquiryForm
              key={claim ? "claim" : "new"}
              kind={claim ? "claim" : "new"}
              hidden={listing ? { listing: listing.slug } : {}}
              submitLabel={claim ? "Send claim request" : "Send for review"}
              fields={[
                { name: "business_name", label: "Business name", required: true, autoComplete: "organization", defaultValue: listing?.title },
                ...(claim ? [] : [
                  { name: "website", label: "Website", type: "url", autoComplete: "url" },
                  { name: "category", label: "Industry", hint: `For example: ${sectors.slice(0, 3).map((s) => s.name).join(", ")}` },
                  { name: "city", label: "City and province", hint: "For example: Mississauga, ON", autoComplete: "address-level2" },
                ]),
                { name: "contact_name", label: "Your name", required: true, autoComplete: "name" },
                { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", hint: claim ? "Use an email on the business’s own domain so we can confirm ownership quickly." : undefined },
                { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
                { name: "message", label: claim ? "What should we update?" : "What does your business do?", textarea: true, hint: claim ? undefined : "Two or three sentences about your services and who you work with." },
              ]}
            />
          </div>
        </div>
        <aside className="h-fit rounded-xl bg-mist p-7">
          <h2 className="font-bold text-navy">What you get</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem]">
            <li>A business page with your description, contact details and links</li>
            <li>A place in industry and province searches across Canada</li>
            <li>A link back to your website</li>
            <li>Visibility with CanadianSME Small Business Magazine readers</li>
          </ul>
          <p className="mt-5 text-[0.95rem] text-muted">
            Questions? <Link href="/contact/" className="text-blue underline">Contact the SMB Connect team</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}
