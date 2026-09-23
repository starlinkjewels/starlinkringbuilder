/**
 * Starlink Jewels contact details — the same figures the main site uses
 * (starlink/src/lib/seo.ts), so the studio and the store never disagree.
 */
export const CONTACT = {
  phone: "+1 (201) 554-4824",
  phoneHref: "tel:+12015544824",
  /** wa.me wants digits only: country code included, no "+", spaces or brackets. */
  whatsapp: "12015544824",
  email: "info@starlinkjewels.com",
  website: "https://www.starlinkjewels.com",
  websiteLabel: "starlinkjewels.com",
  social: [
    { label: "Instagram", href: "https://instagram.com/starlinkjewels" },
    { label: "Facebook", href: "https://facebook.com/starlinkjewels" },
    { label: "Pinterest", href: "https://pinterest.com/starlinkjewels" },
  ],
  offices: [
    { label: "USA", lines: ["55 John St", "East Rutherford, NJ 07073"] },
    { label: "India", lines: ["Workshop", "Surat, Gujarat"] },
  ],
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${CONTACT.email}?${params.toString().replace(/\+/g, "%20")}`;
}
