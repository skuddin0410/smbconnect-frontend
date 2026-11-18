import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the SMB Connect team at CanadianSME Small Business Magazine.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12">
      <div className="grid gap-14 lg:grid-cols-[1fr_22rem]">
        <div className="max-w-2xl">
          <h1 className="display text-[2.2rem] text-navy sm:text-[2.8rem]">Contact us</h1>
          <p className="mt-3 text-lg text-muted">
            Questions about a listing, advertising or partnerships? Send us a message and we’ll reply within two business days.
          </p>
          <div className="mt-8">
            <EnquiryForm
              kind="contact"
              submitLabel="Send message"
              fields={[
                { name: "contact_name", label: "Your name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "business_name", label: "Company", autoComplete: "organization" },
                { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
                { name: "message", label: "Message", textarea: true, required: true },
              ]}
            />
          </div>
        </div>
        <aside className="h-fit rounded-xl bg-mist p-7">
          <h2 className="font-bold text-navy">CanadianSME Small Business Magazine</h2>
          <address className="mt-3 not-italic text-[0.98rem] leading-relaxed">
            6345 Dixie Rd, Unit 202<br />Mississauga, ON L5T 2E6
          </address>
        </aside>
      </div>
    </div>
  );
}
