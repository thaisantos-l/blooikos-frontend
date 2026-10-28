export interface SiteLink {
  id: string;
  label: string;
  href: string;
  target?: '_blank';
}
export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface SiteChrome {
  brandName: string;
  logo: SiteImage;
  logoInverse?: SiteImage;
  primaryNavigation: SiteLink[];
  footerNavigation: SiteLink[];
  description: string;
  companies: { id: string; name: string; link?: Omit<SiteLink, 'id'> }[];
  contacts: {
    phone?: { label: string; href: string };
    email?: { label: string; href: string };
    instagram?: string;
    address?: string;
  };
  copyrightHolder: string;
  year: string;
}
export interface PocIssue {
  code:
    | 'MISSING_REQUIRED_CONTENT'
    | 'INVALID_CONTENT'
    | 'INCOMPLETE_COLLECTION'
    | 'INVALID_DESTINATION'
    | 'INVALID_MEDIA'
    | 'CONFIG_ERROR';
  path: string;
}
export class PocValidationError extends Error {
  constructor(public readonly issues: PocIssue[]) {
    super(
      'Conteúdo público incompatível com o perfil poc: ' +
        issues.map((i) => i.code + ' em ' + i.path).join('; '),
    );
    this.name = 'PocValidationError';
  }
}
