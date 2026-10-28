import type { SiteChrome } from '../../lib/site/types';
import { Container } from '../ui/Container';
import { BrandLink } from './BrandLink';
import { PrimaryNavigation } from '../navigation/PrimaryNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation.client';
import styles from './Header.module.scss';
export function Header({ site }: { site: SiteChrome }) {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <BrandLink
          name={site.brandName}
          logo={site.logoInverse ?? site.logo}
          placement="header"
        />
        <PrimaryNavigation links={site.primaryNavigation} />
        <MobileNavigation links={site.primaryNavigation} />
      </Container>
    </header>
  );
}
