'use client';
import { Footer } from '../layout/Footer';
import { useSiteContent } from './ContentProvider';
export function LiveFooter() {
  return <Footer site={useSiteContent().content.site} />;
}
