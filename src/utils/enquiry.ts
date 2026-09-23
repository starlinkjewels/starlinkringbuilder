/**
 * Plain-text enquiry for WhatsApp and email. There is no online pricing, so
 * an enquiry is how a design becomes a quote — it has to name the exact
 * variant and link back to it.
 */
export interface EnquiryDesign {
  title: string;
  selections: Record<string, string>;
  sku?: string | undefined;
  /** Shareable studio URL; the configuration is encoded in its query string. */
  link?: string | undefined;
}

function describe(design: EnquiryDesign, index?: number): string {
  const heading = index === undefined ? design.title : `${index + 1}. ${design.title}`;
  const lines = [heading];
  for (const [key, value] of Object.entries(design.selections)) lines.push(`• ${key}: ${value}`);
  if (design.sku) lines.push(`• Ref: ${design.sku}`);
  if (design.link) lines.push(design.link);
  return lines.join("\n");
}

export function enquiryMessage(designs: EnquiryDesign[]): string {
  const intro =
    designs.length === 1
      ? "Hi Starlink Jewels! I designed this ring in your Ring Studio and would like a quote:"
      : "Hi Starlink Jewels! I designed these rings in your Ring Studio and would like a quote:";
  return [intro, ...designs.map((d, i) => describe(d, designs.length === 1 ? undefined : i))].join(
    "\n\n",
  );
}
