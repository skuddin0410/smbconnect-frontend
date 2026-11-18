import sanitizeHtml from "sanitize-html";

const PROVINCE_NAMES: Record<string, string> = {
  ON: "Ontario", QC: "Quebec", BC: "British Columbia", AB: "Alberta", MB: "Manitoba",
  SK: "Saskatchewan", NS: "Nova Scotia", NB: "New Brunswick", NL: "Newfoundland and Labrador",
  PE: "Prince Edward Island", YT: "Yukon", NT: "Northwest Territories", NU: "Nunavut",
};
export const provinceName = (code?: string | null) => (code ? PROVINCE_NAMES[code] ?? code : null);

export function placeLine(city?: string | null, province?: string | null) {
  const p = provinceName(province);
  if (city && province) return `${city}, ${province}`;
  return city ?? p ?? null;
}

/** Two-letter monogram for businesses without a logo. */
export function monogram(title: string) {
  const words = title
    .replace(/[^\p{L}\p{N}\s&]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !/^(the|and|&|of|inc|ltd|llc|corp)$/i.test(w));
  const letters = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? words[0]?.[1] ?? "");
  return letters.toUpperCase() || "SB";
}

/** Deterministic tile tone per business so monograms aren't all the same colour. */
const TONES = ["tone-navy", "tone-blue", "tone-sky", "tone-amber", "tone-slate"];
export function toneFor(id: number) {
  return TONES[id % TONES.length];
}

export function cleanUrl(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim().split(/\s/)[0];
  if (!/^https?:\/\//i.test(trimmed)) return /\./.test(trimmed) ? `https://${trimmed}` : null;
  return trimmed;
}

export function displayHost(url?: string | null) {
  const u = cleanUrl(url);
  if (!u) return null;
  try {
    return new URL(u).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function telHref(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.length >= 7 ? `tel:${digits}` : null;
}

/** Listing descriptions came from a WordPress site that was compromised: allow formatting only. */
export function safeDescription(html?: string | null) {
  if (!html) return "";
  return sanitizeHtml(html.replace(/\[\/?[a-z_]+[^\]]*\]/gi, ""), {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "h2", "h3", "h4", "a", "blockquote"],
    allowedAttributes: { a: ["href", "rel", "target"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "nofollow noopener", target: "_blank" },
      }),
      h1: "h2",
    },
    exclusiveFilter: (frame) => ["p", "li"].includes(frame.tag) && !frame.text.trim(),
  });
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function fixMojibake(s?: string | null) {
  if (!s) return s ?? null;
  return s.replace(/窶冱/g, "’s").replace(/窶/g, "’");
}

/** "+14168396995" → "+1 416-839-6995"; leaves non-North-American numbers as entered. */
export function prettyPhone(phone?: string | null) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  const n = d.length === 11 && d.startsWith("1") ? d.slice(1) : d.length === 10 ? d : null;
  return n ? `+1 ${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}` : phone.trim();
}

/** "09:00am" → "9:00 am" */
export function prettyTime(t?: string) {
  if (!t) return "";
  const m = t.trim().match(/^0?(\d{1,2}):(\d{2})\s*([ap]m)?$/i);
  return m ? `${m[1]}:${m[2]}${m[3] ? ` ${m[3].toLowerCase()}` : ""}` : t;
}
