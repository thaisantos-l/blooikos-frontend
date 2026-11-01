export interface RichTextOptions {
  production?: boolean;
  siteOrigin?: string;
  readText: (html: string) => string;
}

// Presence only. HTML is sanitized by the CMS, never rewritten here.
export function visibleText(
  html: string,
  readText: RichTextOptions['readText'],
) {
  return readText(html)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

// Called only while processing verified content after hydration.
export function browserText(html: string): string {
  return (
    new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  );
}
