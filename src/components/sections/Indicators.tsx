import type { CSSProperties } from 'react';
import type { IndicatorsContent } from '../../lib/site/normalize-indicators';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import headingStyles from '../ui/SectionHeading.module.scss';
import styles from './Indicators.module.scss';

export function Indicators({ indicators }: { indicators: IndicatorsContent }) {
  const { eyebrow, title, items } = indicators;
  if (!eyebrow && !title && !items.length)
    return <div id="indicadores" tabIndex={-1} />;

  return (
    <section
      id="indicadores"
      tabIndex={-1}
      aria-labelledby={title ? 'indicators-title' : undefined}
      className={styles.section}
    >
      <Container>
        {title ? (
          <SectionHeading
            id="indicators-title"
            title={title}
            eyebrow={eyebrow}
            align="center"
            tone="inverse"
            className={styles.heading}
          />
        ) : eyebrow ? (
          <p className={`${headingStyles.eyebrow} ${styles.eyebrow}`}>
            {eyebrow}
          </p>
        ) : null}
        {items.length ? (
          <ul
            className={styles.items}
            style={{ '--indicator-count': items.length } as CSSProperties}
          >
            {items.map((item, index) => (
              <li key={index} className={styles.item}>
                {item.value ? (
                  <p className={styles.value}>{item.value}</p>
                ) : null}
                {item.label ? (
                  <p className={styles.label}>{item.label}</p>
                ) : null}
                {item.description ? (
                  <p className={styles.description}>{item.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
