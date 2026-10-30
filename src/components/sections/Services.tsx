import type { ServicesContent } from '../../lib/site/normalize-services';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import headingStyles from '../ui/SectionHeading.module.scss';
import styles from './Services.module.scss';

export function Services({ services }: { services: ServicesContent }) {
  const { eyebrow, title, description, variant, items } = services;
  const hasHeading = Boolean(eyebrow || title || description);
  if (!hasHeading && !items.length) return <div id="servicos" tabIndex={-1} />;
  const CardHeading = title ? 'h3' : 'h2';

  return (
    <section
      id="servicos"
      tabIndex={-1}
      aria-labelledby={title ? 'services-title' : undefined}
      className={`${styles.section} ${styles[variant]}`}
    >
      <Container>
        {hasHeading ? (
          <div className={styles.presentation}>
            {title ? (
              <SectionHeading
                id="services-title"
                title={title}
                eyebrow={eyebrow}
                className={styles.heading}
              />
            ) : eyebrow ? (
              <p className={`${headingStyles.eyebrow} ${styles.eyebrow}`}>
                {eyebrow}
              </p>
            ) : null}
            {description ? (
              <p
                className={`${headingStyles.description} ${styles.description}`}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {items.length ? (
          <ul className={styles.cards}>
            {items.map((item, index) => (
              <li key={index} className={styles.card}>
                {item.icon ? (
                  <ResponsiveImage
                    {...item.icon}
                    alt=""
                    fit="contain"
                    className={styles.icon}
                  />
                ) : null}
                {item.title ? (
                  <CardHeading className={styles.cardTitle}>
                    {item.title}
                  </CardHeading>
                ) : null}
                {item.description ? (
                  <p className={styles.cardDescription}>{item.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
