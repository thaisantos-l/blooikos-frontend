import { validateHref } from '../../lib/links';
import styles from './ResponsiveImage.module.scss';

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: 'contain' | 'cover';
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'auto' | 'high' | 'low';
  candidates?: readonly { src: string; width: number }[];
  sizes?: string;
  id?: string;
  className?: string;
}

function imageSource(value: string) {
  const src = validateHref(value);
  if (!(src.startsWith('/') || /^https?:\/\//i.test(src)) || src.includes(','))
    throw new Error('Origem de imagem inválida.');
  return src;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fit = 'contain',
  loading = 'lazy',
  fetchPriority = 'auto',
  candidates,
  sizes,
  className = '',
  id,
}: ResponsiveImageProps) {
  if (
    !Number.isSafeInteger(width) ||
    width <= 0 ||
    !Number.isSafeInteger(height) ||
    height <= 0
  )
    throw new Error('Dimensões de imagem inválidas.');
  if (typeof alt !== 'string')
    throw new Error('Alt deve ser explícito, inclusive quando decorativo.');
  if (loading === 'lazy' && fetchPriority === 'high')
    throw new Error('Prioridade alta exige loading eager.');
  let srcSet: string | undefined;
  if (candidates) {
    if (!candidates.length || !sizes?.trim())
      throw new Error('Candidatos exigem sizes e ao menos uma imagem.');
    const widths = new Set<number>();
    const sources = new Set<string>();
    srcSet = [...candidates]
      .sort((a, b) => a.width - b.width)
      .map((candidate) => {
        const source = imageSource(candidate.src);
        if (
          !Number.isSafeInteger(candidate.width) ||
          candidate.width <= 0 ||
          widths.has(candidate.width) ||
          sources.has(source)
        )
          throw new Error(
            'Candidatos devem ter larguras e arquivos distintos.',
          );
        widths.add(candidate.width);
        sources.add(source);
        return `${source} ${candidate.width}w`;
      })
      .join(', ');
  } else if (sizes !== undefined)
    throw new Error('Sizes exige candidatos reais.');
  // O consumidor garante mesma composição/proporção dos arquivos; não há download/transformação aqui.
  return (
    // eslint-disable-next-line @next/next/no-img-element -- img nativo para export estático com mídia já preparada.
    <img
      id={id}
      className={`${styles.image} ${styles[fit]} ${className}`}
      src={imageSource(src)}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  );
}
