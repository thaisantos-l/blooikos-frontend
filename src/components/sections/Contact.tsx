/* eslint-disable @next/next/no-img-element -- Assets decorativos locais, sem otimização remota. */
import type { ContactContent } from '../../lib/site/normalize-contact';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { TextLink } from '../ui/TextLink';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.scss';

function Icon({
  name,
}: {
  name: 'location' | 'phone' | 'email' | 'instagram';
}) {
  return (
    <img
      src={`/icons/contact/${name}.png`}
      width={24}
      height={24}
      alt=""
      loading="lazy"
      decoding="async"
      className={styles.icon}
    />
  );
}

export function Contact({
  contact,
  endpoint,
}: {
  contact: ContactContent;
  endpoint: string;
}) {
  const { eyebrow, title, variant, company, contacts, showForm } = contact;
  const hasContacts = company || Object.values(contacts).some(Boolean);
  if (!eyebrow && !title && !hasContacts && !showForm)
    return <div id="contato" tabIndex={-1} />;
  return (
    <section
      id="contato"
      tabIndex={-1}
      aria-labelledby={title ? 'contact-title' : undefined}
      className={`${styles.section} ${styles[variant]}`}
    >
      <Container>
        {title ? (
          <SectionHeading
            id="contact-title"
            title={title}
            eyebrow={eyebrow || undefined}
            className={styles.heading}
          />
        ) : eyebrow ? (
          <p className={styles.eyebrow}>{eyebrow}</p>
        ) : null}
        {showForm || hasContacts ? (
          <div
            className={`${styles.layout} ${showForm && hasContacts ? styles.twoColumns : ''}`}
          >
            {showForm ? <ContactForm endpoint={endpoint} /> : null}
            {hasContacts ? (
              <div className={styles.contacts}>
                {company ? (
                  <p className={`${styles.contactRow} ${styles.company}`}>
                    <span className={styles.companyIcon}>
                      <img
                        src="/icons/contact/company-background.svg"
                        width={25}
                        height={25}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src="/icons/contact/company-mark.svg"
                        width={10}
                        height={15}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <strong>{company}</strong>
                  </p>
                ) : null}
                {contacts.address ? (
                  <p className={styles.contactRow}>
                    <Icon name="location" />
                    <span className={styles.address}>
                      {contacts.address.replace(/[\u2028\u2029]/g, '\n')}
                    </span>
                  </p>
                ) : null}
                {contacts.phone ? (
                  <p className={styles.contactRow}>
                    <Icon name="phone" />
                    <TextLink href={contacts.phone.href}>
                      {contacts.phone.label}
                    </TextLink>
                  </p>
                ) : null}
                {contacts.email ? (
                  <p className={styles.contactRow}>
                    <Icon name="email" />
                    <TextLink href={contacts.email.href}>
                      {contacts.email.label}
                    </TextLink>
                  </p>
                ) : null}
                {contacts.instagram ? (
                  <p className={styles.contactRow}>
                    <Icon name="instagram" />
                    <TextLink href={contacts.instagram}>Instagram</TextLink>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
