'use client';
import { Footer } from '../layout/Footer';
import { useSiteContent } from './ContentProvider';

export function LiveFooter() {
  const { content, social } = useSiteContent();
  return (
    <Footer
      site={content.site}
      social={social.companies}
      contactInstagram={social.contactInstagram}
    />
  );
}
