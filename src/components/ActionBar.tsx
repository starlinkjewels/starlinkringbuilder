import { BagIcon, WhatsAppIcon } from "./ContactIcons";

/**
 * The current design and the two ways forward, pinned to the bottom of the
 * configuration column so neither is ever scrolled away from. Enquiry leads:
 * there is no online price, so a quote is the next step.
 */
export function ActionBar({
  summary,
  sku,
  added,
  enquiryHref,
  onAddToCart,
}: {
  summary: string;
  sku: string;
  added: boolean;
  enquiryHref: string;
  onAddToCart: () => void;
}) {
  return (
    <div className="action-bar" data-testid="action-bar">
      <dl className="action-bar__summary">
        <dt>Your design</dt>
        <dd data-testid="design-summary">{summary}</dd>
        <span className="action-bar__sku">Ref {sku}</span>
      </dl>
      <div className="action-bar__buttons">
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={onAddToCart}
          data-testid="add-to-cart"
          aria-label={added ? "Added to bag" : "Add to bag"}
          title={added ? "Added to bag" : "Add to bag"}
        >
          <BagIcon size={17} />
          <span className="btn__text">{added ? "Added" : "Add to bag"}</span>
        </button>
        <a
          className="btn btn--primary"
          href={enquiryHref}
          target="_blank"
          rel="noreferrer"
          data-testid="enquire"
        >
          <WhatsAppIcon />
          <span className="btn__text">Enquire for price</span>
        </a>
      </div>
    </div>
  );
}
