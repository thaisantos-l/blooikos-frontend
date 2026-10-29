import type { SiteChrome } from '../../lib/site/types';
import { Container } from '../ui/Container';
import { BrandLink } from './BrandLink';
import { PrimaryNavigation } from '../navigation/PrimaryNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation.client';
import styles from './Header.module.scss';
export function Header({
  site,
  variant = 'solid',
}: {
  site: SiteChrome;
  variant?: 'solid' | 'hero';
}) {
  if (
    !site.brandName &&
    !site.logo &&
    !site.logoInverse &&
    !site.primaryNavigation.length
  )
    return <header />;
  return (
    <header
      className={`${styles.header} ${variant === 'hero' ? styles.hero : ''}`}
    >
      <Container className={styles.inner}>
        <BrandLink
          name={site.brandName}
          logo={site.logoInverse ?? site.logo}
          placement="header"
        />
        {site.primaryNavigation.length ? (
          <>
            <PrimaryNavigation links={site.primaryNavigation} />
            <MobileNavigation links={site.primaryNavigation} />
          </>
        ) : null}
      </Container>
    </header>
  );
}
