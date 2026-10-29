import type { HeroContent } from '../../lib/site/validate-hero';
import { Container } from '../ui/Container';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { ActionLink } from '../ui/ActionLink';
import styles from './Hero.module.scss';

export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-hero>
      <ResponsiveImage
        {...hero.background}
        alt=""
        fit="cover"
        sizes={hero.background.candidates ? '100vw' : undefined}
        loading="eager"
        fetchPriority="high"
        className={styles.background}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <Container className={styles.content}>
        {hero.eyebrow ? <p className={styles.eyebrow}>{hero.eyebrow}</p> : null}
        <h1 id="hero-title" className={styles.title}>
          <span>{hero.titleBefore}</span>
          {hero.titleHighlight ? (
            <>
              {' '}
              <span className={styles.highlight}>{hero.titleHighlight}</span>
            </>
          ) : null}
          {hero.titleAfter ? (
            <>
              {' '}
              <span>{hero.titleAfter}</span>
            </>
          ) : null}
        </h1>
        <p className={styles.description}>{hero.description}</p>
        <div className={styles.actions}>
          <ActionLink
            href={hero.primaryCta.href}
            target={hero.primaryCta.target}
          >
            {hero.primaryCta.label}
          </ActionLink>
          {hero.secondaryCta ? (
            <ActionLink
              variant="outline-inverse"
              href={hero.secondaryCta.href}
              target={hero.secondaryCta.target}
            >
              {hero.secondaryCta.label}
            </ActionLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
