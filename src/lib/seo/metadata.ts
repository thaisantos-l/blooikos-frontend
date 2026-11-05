import type { Metadata } from 'next';
import type { ResolvedSeo } from './normalize';

export function homeMetadata(seo: ResolvedSeo): Metadata {
  return {
    metadataBase: new URL(seo.origin),
    title: { absolute: seo.title },
    description: seo.description || undefined,
    alternates: { canonical: seo.canonical },
    robots: { index: seo.index, follow: seo.follow },
    openGraph: {
      type: 'website',
      url: seo.url,
      siteName: seo.name,
      locale: seo.language.replace('-', '_'),
      title: seo.openGraph.title,
      description: seo.openGraph.description || undefined,
      images: seo.openGraph.image ? [seo.openGraph.image] : [],
    },
    twitter: {
      card: seo.twitter.image ? 'summary_large_image' : 'summary',
      title: seo.twitter.title,
      description: seo.twitter.description || undefined,
      images: seo.twitter.image ? [seo.twitter.image] : [],
    },
  };
}

// The same resolved values drive the DOM updates and Metadata API above.
export function metaTags(seo: ResolvedSeo): Record<string, string | undefined> {
  return {
    description: seo.description || undefined,
    robots: `${seo.index ? 'index' : 'noindex'}, ${seo.follow ? 'follow' : 'nofollow'}`,
    'og:type': 'website',
    'og:url': seo.url,
    'og:site_name': seo.name,
    'og:locale': seo.language.replace('-', '_'),
    'og:title': seo.openGraph.title,
    'og:description': seo.openGraph.description || undefined,
    'og:image': seo.openGraph.image?.url,
    'og:image:width': seo.openGraph.image?.width?.toString(),
    'og:image:height': seo.openGraph.image?.height?.toString(),
    'og:image:alt': seo.openGraph.image?.alt,
    'twitter:card': seo.twitter.image ? 'summary_large_image' : 'summary',
    'twitter:title': seo.twitter.title,
    'twitter:description': seo.twitter.description || undefined,
    'twitter:image': seo.twitter.image?.url,
    'twitter:image:alt': seo.twitter.image?.alt,
  };
}
