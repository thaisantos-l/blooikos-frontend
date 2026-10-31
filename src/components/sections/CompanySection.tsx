import type { CompanyContent } from '../../lib/site/normalize-companies';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { LinkArrow } from '../ui/LinkArrow';
import headingStyles from '../ui/SectionHeading.module.scss';
import styles from './CompanySection.module.scss';

export function CompanySection({
  company,
  headingId,
  imageSide,
  tone,
}: {
  company: CompanyContent;
  headingId: string;
  imageSide: 'left' | 'right';
  tone: 'light' | 'muted';
}) {
  const { logo, eyebrow, heading, body, image, cta } = company;
  const hasPresentation = Boolean(logo || eyebrow || heading || body || cta);
  if (!hasPresentation && !image) return null;
  const sizes = hasPresentation
    ? '(min-width: 1296px) 600px, (min-width: 992px) calc(50vw - 3rem), calc(100vw - 2rem)'
    : '(min-width: 800px) 768px, calc(100vw - 2rem)';

  return (
    <section
      aria-labelledby={heading ? headingId : undefined}
      className={`${styles.section} ${styles[tone]}`}
    >
      <Container
        className={`${styles.layout} ${hasPresentation && image ? styles.paired : ''} ${imageSide === 'left' ? styles.imageLeft : ''}`}
      >
        {hasPresentation ? (
          <div className={styles.presentation}>
            {logo ? (
              <ResponsiveImage
                {...logo}
                fit="contain"
                className={styles.logo}
              />
            ) : null}
            {heading ? (
              <SectionHeading
                id={headingId}
                title={heading}
                eyebrow={eyebrow}
                className={styles.heading}
              />
            ) : eyebrow ? (
              <p className={`${headingStyles.eyebrow} ${styles.eyebrow}`}>
                {eyebrow}
              </p>
            ) : null}
            {body ? (
              // Apenas o WYSIWYG sanitizado pelo CMS recebe HTML.
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : null}
            {cta ? (
              <LinkArrow
                href={cta.href}
                target={cta.target}
                className={styles.cta}
              >
                {cta.label}
              </LinkArrow>
            ) : null}
          </div>
        ) : null}
        {image ? (
          <div className={styles.photo}>
            <ResponsiveImage
              {...image}
              fit="cover"
              sizes={image.candidates ? sizes : undefined}
              className={styles.image}
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
