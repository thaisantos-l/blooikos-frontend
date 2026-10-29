import { hasHeroContent, type HeroContent } from '../../lib/site/validate-hero';
import { Container } from '../ui/Container';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { ActionLink } from '../ui/ActionLink';
import styles from './Hero.module.scss';

export function Hero({ hero }: { hero: HeroContent }) {
  if (!hasHeroContent(hero)) return null;
  const titles = [hero.titleBefore, hero.titleHighlight, hero.titleAfter];
  const hasTitle = titles.some(Boolean);
  return (
    <section
      className={styles.hero}
      aria-labelledby={hasTitle ? 'hero-title' : undefined}
      data-hero
    >
      {hero.background ? (
        <ResponsiveImage
          {...hero.background}
          alt=""
          fit="cover"
          sizes={hero.background.candidates ? '100vw' : undefined}
          loading="eager"
          fetchPriority="high"
          className={styles.background}
        />
      ) : null}
      {hero.background ? (
        <div className={styles.overlay} aria-hidden="true" />
      ) : null}
      <Container className={styles.content}>
        {hero.eyebrow ? <p className={styles.eyebrow}>{hero.eyebrow}</p> : null}
        {hasTitle ? (
          <h1 id="hero-title" className={styles.title}>
            {titles.map((title, index) =>
              title ? (
                <span
                  key={index}
                  className={index === 1 ? styles.highlight : undefined}
                >
                  {index > 0 && titles.slice(0, index).some(Boolean) ? ' ' : ''}
                  {title}
                </span>
              ) : null,
            )}
          </h1>
        ) : null}
        {hero.description ? (
          <p className={styles.description}>{hero.description}</p>
        ) : null}
        {hero.primaryCta || hero.secondaryCta ? (
          <div className={styles.actions}>
            {hero.primaryCta ? (
              <ActionLink
                href={hero.primaryCta.href}
                target={hero.primaryCta.target}
              >
                {hero.primaryCta.label}
              </ActionLink>
            ) : null}
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
        ) : null}
      </Container>
    </section>
  );
}
