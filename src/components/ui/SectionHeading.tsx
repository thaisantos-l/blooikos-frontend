import styles from './SectionHeading.module.scss';

export interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  level?: 2 | 3;
  tone?: 'default' | 'inverse';
  align?: 'start' | 'center';
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  level = 2,
  tone = 'default',
  align = 'start',
  id,
  className = '',
}: SectionHeadingProps) {
  if (!title.trim()) throw new Error('SectionHeading exige título.');
  const Heading = level === 3 ? 'h3' : 'h2';
  return (
    <div
      className={`${styles.heading} ${tone === 'inverse' ? styles.inverse : ''} ${styles[align]} ${className}`}
    >
      {eyebrow?.trim() ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {description?.trim() ? (
        <p className={styles.description}>{description}</p>
      ) : null}
    </div>
  );
}
