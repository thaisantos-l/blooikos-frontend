import { TextLink } from '../ui/TextLink';
import type { SiteLink } from '../../lib/site/types';
import styles from './Navigation.module.scss';
export function PrimaryNavigation({ links }: { links: SiteLink[] }) {
  return (
    <nav
      id="primary-navigation"
      className={styles.desktop}
      aria-label="Navegação principal"
    >
      <ul className={styles.desktopList}>
        {links.map((link) => (
          <li key={link.id}>
            <TextLink
              data-navigation-id={link.id}
              href={link.href}
              target={link.target}
              typography="navigation"
              tone="inverse"
            >
              {link.label}
            </TextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
