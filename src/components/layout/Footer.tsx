import type { SiteChrome } from '../../lib/site/types';
import { Container } from '../ui/Container';
import { TextLink } from '../ui/TextLink';
import { BrandLink } from './BrandLink';
import styles from './Footer.module.scss';
export function Footer({ site }: { site: SiteChrome }) {
  const contact = site.contacts;
  const hasContact = Boolean(
    contact.phone || contact.email || contact.instagram || contact.address,
  );
  const hasIdentity = Boolean(
    site.brandName || site.logo || site.logoInverse || site.description,
  );
  if (
    !hasIdentity &&
    !site.footerNavigation.length &&
    !site.companies.length &&
    !hasContact &&
    !site.copyrightHolder
  )
    return <footer />;
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.columns}>
          {hasIdentity ? (
            <div className={styles.identity}>
              <BrandLink
                name={site.brandName}
                logo={site.logoInverse ?? site.logo}
                placement="footer"
              />
              {site.description ? (
                <p className={styles.description}>{site.description}</p>
              ) : null}
            </div>
          ) : null}
          {site.footerNavigation.length ? (
            <nav aria-label="Grupo — rodapé">
              <h2 className={styles.heading}>Grupo</h2>
              <ul className={styles.list}>
                {site.footerNavigation.map((link) => (
                  <li key={link.id}>
                    <TextLink
                      typography="footer"
                      tone="inverse"
                      href={link.href}
                      target={link.target}
                    >
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {site.companies.length ? (
            <nav aria-label="Empresas — rodapé">
              <h2 className={styles.heading}>Empresas</h2>
              <ul className={styles.list}>
                {site.companies.map((company) => (
                  <li key={company.id}>
                    {company.link ? (
                      <TextLink
                        typography="footer"
                        tone="inverse"
                        href={company.link.href}
                        target={company.link.target}
                      >
                        {company.name}
                      </TextLink>
                    ) : (
                      <span className={styles.company}>{company.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {hasContact ? (
            <section aria-labelledby="footer-contact-title">
              <h2 id="footer-contact-title" className={styles.heading}>
                Contato
              </h2>
              <ul className={styles.list}>
                {contact.phone ? (
                  <li>
                    <TextLink
                      typography="footer"
                      tone="inverse"
                      href={contact.phone.href}
                    >
                      {contact.phone.label}
                    </TextLink>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <TextLink
                      typography="footer"
                      tone="inverse"
                      href={contact.email.href}
                    >
                      {contact.email.label}
                    </TextLink>
                  </li>
                ) : null}
                {contact.instagram ? (
                  <li>
                    <TextLink
                      typography="footer"
                      tone="inverse"
                      href={contact.instagram}
                    >
                      Instagram
                    </TextLink>
                  </li>
                ) : null}
                {contact.address ? (
                  <li className={styles.address}>{contact.address}</li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </div>
        {site.copyrightHolder ? (
          <p className={styles.copyright}>
            © {site.year} {site.copyrightHolder}. Todos os direitos reservados.
          </p>
        ) : null}
      </Container>
    </footer>
  );
}
