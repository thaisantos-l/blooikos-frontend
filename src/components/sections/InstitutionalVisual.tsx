import type { InstitutionalContent } from '../../lib/site/normalize-institutional';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import styles from './InstitutionalVisual.module.scss';

export function InstitutionalVisual({
  institutional,
}: {
  institutional: InstitutionalContent;
}) {
  const { image } = institutional;
  if (!image) return null;

  return (
    <div className={styles.visual}>
      <ResponsiveImage
        {...image}
        fit="cover"
        sizes={image.candidates ? '100vw' : undefined}
        className={styles.image}
      />
    </div>
  );
}
