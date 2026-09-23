import { CONTACT, mailtoLink } from "@/data/contact";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./ContactIcons";

/** "Talk to us" block closing the configuration column. */
export function ContactCard({ enquiryHref, subject }: { enquiryHref: string; subject: string }) {
  return (
    <section className="contact-card" aria-labelledby="contact-card-title">
      <p className="eyebrow">Need help?</p>
      <h2 id="contact-card-title" className="contact-card__title">
        Talk to a Starlink jewellery expert
      </h2>
      <p className="contact-card__text">
        Share your design and we will send a quote, certified stone options and CAD renders before
        anything is made.
      </p>

      <ul className="contact-card__list">
        <li>
          <a href={enquiryHref} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={14} />
            <span>
              WhatsApp<small>{CONTACT.phone}</small>
            </span>
          </a>
        </li>
        <li>
          <a href={CONTACT.phoneHref}>
            <PhoneIcon />
            <span>
              Call us<small>{CONTACT.phone}</small>
            </span>
          </a>
        </li>
        <li>
          <a href={mailtoLink(subject)}>
            <MailIcon />
            <span>
              Email<small>{CONTACT.email}</small>
            </span>
          </a>
        </li>
      </ul>

      <div className="contact-card__offices">
        {CONTACT.offices.map((office) => (
          <address key={office.label}>
            <strong>{office.label}</strong>
            {office.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        ))}
      </div>

      <div className="contact-card__social">
        {CONTACT.social.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
