import type { AboutContent } from '../../lib/site/normalize-about';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { LinkArrow } from '../ui/LinkArrow';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import headingStyles from '../ui/SectionHeading.module.scss';
import styles from './About.module.scss';

export function About({ about }: { about: AboutContent }) {
  const hasText = Boolean(
    about.eyebrow || about.title || about.body || about.cta,
  );
  if (!hasText && !about.companies.length)
    return <div id="quem-somos" tabIndex={-1} />;

  return (
    <section
      id="quem-somos"
      tabIndex={-1}
      aria-labelledby={about.title ? 'about-title' : undefined}
      className={`${styles.section} ${styles[about.variant]}`}
    >
      <Container className={styles.layout}>
        {hasText ? (
          <div className={styles.presentation}>
            {about.title ? (
              <SectionHeading
                id="about-title"
                title={about.title}
                eyebrow={about.eyebrow}
              />
            ) : about.eyebrow ? (
              <p className={headingStyles.eyebrow}>{about.eyebrow}</p>
            ) : null}
            {about.body ? (
              // Somente o WYSIWYG sanitizado do contrato próprio; demais campos são texto React.
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: about.body }}
              />
            ) : null}
            {about.cta ? (
              <LinkArrow
                href={about.cta.href}
                target={about.cta.target}
                className={styles.cta}
              >
                {about.cta.label}
              </LinkArrow>
            ) : null}
          </div>
        ) : null}
        {about.companies.length ? (
          <ul className={styles.cards}>
            {about.companies.map((company) => (
              <li key={company.id} className={styles.card}>
                {company.icon ? (
                  <ResponsiveImage
                    {...company.icon}
                    alt={
                      company.icon.alt === company.name ? '' : company.icon.alt
                    }
                    className={styles.icon}
                  />
                ) : null}
                {company.name || company.summary ? (
                  <div className={styles.companyText}>
                    {company.name ? (
                      <p className={styles.name}>{company.name}</p>
                    ) : null}
                    {company.summary ? (
                      <p className={styles.summary}>{company.summary}</p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
