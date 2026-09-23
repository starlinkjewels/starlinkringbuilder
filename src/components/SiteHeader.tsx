import logo from "@/assets/starlink-logo.png";
import { BRAND_NAME } from "@/data/ringOptions";
import { CONTACT } from "@/data/contact";
import { BagIcon, MailIcon, PhoneIcon } from "./ContactIcons";

export function SiteHeader({
  cartCount,
  onOpenCart,
}: {
  cartCount: number;
  onOpenCart: () => void;
}) {
  return (
    <header className="site-header">
      {/* Contact strip — hidden on small screens, where the contact card in
          the configuration column carries the same details. */}
      <div className="topbar">
        <div className="topbar__contact">
          <a href={CONTACT.phoneHref}>
            <PhoneIcon size={12} />
            {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <MailIcon size={12} />
            {CONTACT.email}
          </a>
        </div>
        <span className="topbar__note">Certified diamonds · Made to order · Insured shipping</span>
      </div>

      <div className="site-header__main">
        <a href={CONTACT.website} className="brand" aria-label={`${BRAND_NAME} home`}>
          <img src={logo} alt={BRAND_NAME} />
        </a>
        <nav className="site-nav" aria-label="Primary">
          <span className="nav-tag">Custom Ring Studio</span>
          <a className="nav-link" href={CONTACT.website}>
            Back to store
          </a>
          <button type="button" className="bag-btn" onClick={onOpenCart} data-testid="open-cart">
            <BagIcon />
            <span className="bag-btn__label">Bag</span>
            {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
