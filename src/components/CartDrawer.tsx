import type { CartItem } from "@/types/ring";
import { mailtoLink, whatsappLink } from "@/data/contact";
import { enquiryMessage } from "@/utils/enquiry";
import { configUrl } from "@/utils/urlState";
import { MailIcon, WhatsAppIcon } from "./ContactIcons";

/** Shares the sheet chrome with the rest of the studio, so it reads as one system. */
export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onClear,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (!open) return null;
  const message = enquiryMessage(
    items.map((item) => ({ ...item, link: configUrl(item.configuration) })),
  );

  return (
    <>
      <button type="button" className="scrim" aria-label="Close bag" onClick={onClose} />
      <aside className="sheet" role="dialog" aria-label="Your bag">
        <div className="sheet__head">
          <h2>Your bag</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close bag">
            ✕
          </button>
        </div>

        <div className="sheet__body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your bag is empty.</p>
              <span>Design a ring to get started.</span>
            </div>
          ) : (
            <ul className="drawer-list">
              {items.map((item) => (
                <li key={item.id}>
                  <p className="drawer-title">{item.title}</p>
                  <p className="drawer-meta">
                    {Object.entries(item.selections)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </p>
                  {/* Optional: items saved before the SKU was stored have none. */}
                  {item.sku && <p className="drawer-sku">{item.sku}</p>}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.title}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="sheet__foot sheet__foot--stack">
            <a
              className="btn btn--primary btn--block"
              href={whatsappLink(message)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon />
              Enquire about {items.length} {items.length === 1 ? "design" : "designs"}
            </a>
            <div className="sheet__foot-row">
              <a className="btn btn--ghost" href={mailtoLink("Ring Studio enquiry", message)}>
                <MailIcon />
                Email
              </a>
              <button type="button" className="btn btn--ghost" onClick={onClear}>
                Clear bag
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
