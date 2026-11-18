"use server";

import { supabase } from "./supabase";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> };

const str = (fd: FormData, k: string, max = 500) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: real people never fill this hidden field.
  if (str(fd, "company_fax")) return { ok: true, message: "Thanks, we’ve received your details." };

  const kind = (["new", "claim", "contact"] as const).find((k) => k === str(fd, "kind")) ?? "new";
  const data = {
    kind,
    business_name: str(fd, "business_name", 200) || null,
    contact_name: str(fd, "contact_name", 120),
    email: str(fd, "email", 200),
    phone: str(fd, "phone", 40) || null,
    website: str(fd, "website", 300) || null,
    city: str(fd, "city", 120) || null,
    category: str(fd, "category", 120) || null,
    message: str(fd, "message", 3000) || null,
  };

  const errors: Record<string, string> = {};
  if (!data.contact_name) errors.contact_name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter an email address like name@company.ca.";
  if (kind !== "contact" && !data.business_name) errors.business_name = "Enter the business name.";
  if (kind === "contact" && !data.message) errors.message = "Enter your message.";
  if (Object.keys(errors).length) return { ok: false, message: "Check the highlighted fields.", errors };

  let listing_id: number | null = null;
  const listingSlug = str(fd, "listing", 200);
  if (kind === "claim" && listingSlug) {
    const { data: l } = await supabase.from("listings").select("id").eq("slug", listingSlug).maybeSingle();
    listing_id = l?.id ?? null;
  }

  const { error } = await supabase.from("submissions").insert({ ...data, listing_id });
  if (error) {
    console.error("submission insert failed", error);
    return { ok: false, message: "Your details weren’t sent because of a problem on our side. Try again in a minute." };
  }
  return {
    ok: true,
    message:
      kind === "contact"
        ? "Message sent. We reply within two business days."
        : kind === "claim"
          ? "Claim request sent. We’ll confirm you own the business by email, usually within two business days."
          : "Listing sent for review. We’ll email you when it’s published, usually within two business days.",
  };
}
