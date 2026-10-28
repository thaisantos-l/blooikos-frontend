import { ResponsiveImage } from '../ui/ResponsiveImage';
import { TextLink } from '../ui/TextLink';
import type { SiteImage } from '../../lib/site/types';
import styles from './BrandLink.module.scss';
export function BrandLink({
  name,
  logo,
  placement,
}: {
  name: string;
  logo: SiteImage;
  placement: 'header' | 'footer';
}) {
  return (
    <TextLink
      href="/"
      aria-label={name + ' — início'}
      className={`${styles.brand} ${styles[placement]}`}
    >
      {/* O link já tem nome; a imagem é decorativa neste uso. O alt editorial permanece no modelo. */}
      <ResponsiveImage
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        loading={placement === 'header' ? 'eager' : 'lazy'}
      />
    </TextLink>
  );
}
