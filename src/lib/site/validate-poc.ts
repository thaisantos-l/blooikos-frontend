import contract from '../../../contracts/cms/v1/contract.json';
import {
  PocValidationError,
  type PocIssue,
  type SiteChrome,
  type SiteImage,
  type SiteLink,
} from './types';
import {
  copyrightYear,
  editorialDestination,
  mediaSource,
  normalizeDestination,
  parseSiteOrigin,
  phoneDestination,
} from './normalize';

export const POC_CONTRACT_VERSION = contract.contractVersion;
type ObjectValue = Record<string, unknown>;
const object = (value: unknown): value is ObjectValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const absent = (value: unknown) =>
  value === null || value === undefined || value === '';
const meaningful = (value: string) =>
  value.replace(/<[^>]*>/g, '').trim().length > 0;

// Valida apenas as seleções do perfil poc; não exige Home nem campos de seções.
export function validatePoc(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string; now?: Date } = {},
): SiteChrome {
  const issues: PocIssue[] = [];
  const issue = (path: string, code: PocIssue['code'] = 'INVALID_CONTENT') => {
    issues.push({ code, path });
  };
  let siteOrigin: string | undefined;
  try {
    siteOrigin = parseSiteOrigin(options.siteOrigin);
  } catch {
    issue('config.SITE_ORIGIN', 'CONFIG_ERROR');
  }
  function record(value: unknown, path: string, required = true): ObjectValue {
    if (absent(value)) {
      if (required) issue(path, 'MISSING_REQUIRED_CONTENT');
      return {};
    }
    if (!object(value)) {
      issue(path);
      return {};
    }
    return value;
  }
  function text(
    value: unknown,
    path: string,
    max = 0,
    required = false,
  ): string {
    if (absent(value)) {
      if (required) issue(path, 'MISSING_REQUIRED_CONTENT');
      return '';
    }
    if (
      typeof value !== 'string' ||
      !meaningful(value) ||
      (max > 0 && [...value].length > max)
    ) {
      issue(path);
      return '';
    }
    return value;
  }
  function destination(
    value: unknown,
    path: string,
    httpsOnly = false,
  ): string {
    if (typeof value !== 'string') {
      issue(path, 'INVALID_DESTINATION');
      return '';
    }
    try {
      return httpsOnly
        ? editorialDestination(value, true)
        : normalizeDestination(value, siteOrigin);
    } catch {
      issue(path, 'INVALID_DESTINATION');
      return '';
    }
  }
  function target(value: unknown, path: string): '_blank' | undefined {
    if (absent(value)) return undefined;
    if (value !== '_blank') {
      issue(path);
      return undefined;
    }
    return value;
  }
  function image(
    value: unknown,
    path: string,
    required: boolean,
  ): SiteImage | undefined {
    if (absent(value)) {
      if (required) issue(path, 'MISSING_REQUIRED_CONTENT');
      return undefined;
    }
    const edge = record(value, path);
    if (!Object.hasOwn(edge, 'node')) {
      issue(path);
      return undefined;
    }
    if (edge.node === null) {
      if (required) issue(path + '.node', 'MISSING_REQUIRED_CONTENT');
      return undefined;
    }
    const node = record(edge.node, path + '.node');
    const dimensions = record(node.mediaDetails, path + '.node.mediaDetails');
    let src = '';
    try {
      if (typeof node.sourceUrl !== 'string') throw new Error();
      src = mediaSource(node.sourceUrl, options.production ?? false);
    } catch {
      issue(path + '.node.sourceUrl', 'INVALID_MEDIA');
    }
    const alt = text(node.altText, path + '.node.altText', 0, true);
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(String(node.mimeType))
    )
      issue(path + '.node.mimeType', 'INVALID_MEDIA');
    for (const key of ['width', 'height'])
      if (
        !Number.isSafeInteger(dimensions[key]) ||
        Number(dimensions[key]) <= 0
      )
        issue(path + '.node.mediaDetails.' + key, 'INVALID_MEDIA');
    return {
      src,
      alt,
      width: Number(dimensions.width),
      height: Number(dimensions.height),
    };
  }
  function connection(value: unknown, path: string, max: number): unknown[] {
    const collection = record(value, path);
    if (!Array.isArray(collection.nodes)) {
      issue(path);
      return [];
    }
    if (collection.nodes.length === 0) issue(path, 'MISSING_REQUIRED_CONTENT');
    if (
      collection.nodes.length > max ||
      !object(collection.pageInfo) ||
      collection.pageInfo.hasNextPage !== false
    )
      issue(path, 'INCOMPLETE_COLLECTION');
    const ids = new Set<string>();
    for (const [index, item] of collection.nodes.entries()) {
      if (object(item) && typeof item.id === 'string') {
        if (ids.has(item.id)) issue(path + '.nodes[' + index + '].id');
        ids.add(item.id);
      }
    }
    return collection.nodes;
  }
  function menu(value: unknown, path: string): SiteLink[] {
    let previous = 0;
    return connection(value, path, 20).map((value, index) => {
      const p = path + '.nodes[' + index + ']';
      const node = record(value, p);
      if (!absent(node.parentId)) issue(p + '.parentId');
      if (!Number.isSafeInteger(node.order) || Number(node.order) <= previous)
        issue(p + '.order');
      previous = Number(node.order);
      return {
        id: text(node.id, p + '.id', 0, true),
        label: text(node.label, p + '.label', 0, true),
        href: destination(node.url, p + '.url'),
        target: target(node.target, p + '.target'),
      };
    });
  }
  const root = record(data, 'data');
  const settings = record(root.blooikosSettings, 'data.blooikosSettings');
  const identityPath = 'data.blooikosSettings.blooikosSiteIdentity';
  const footerPath = 'data.blooikosSettings.blooikosSiteFooter';
  const contactPath = 'data.blooikosSettings.blooikosSiteContact';
  const identity = record(settings.blooikosSiteIdentity, identityPath);
  const footer = record(settings.blooikosSiteFooter, footerPath);
  const contact = record(settings.blooikosSiteContact, contactPath, false);
  const rules = contract.responseRules;
  const brandName = text(
    identity.brandName,
    identityPath + '.brandName',
    rules.Identity.brandName.max,
    true,
  );
  const logo = image(identity.logo, identityPath + '.logo', true);
  const logoInverse = image(
    identity.logoInverse,
    identityPath + '.logoInverse',
    false,
  );
  const description = text(
    footer.footerDescription,
    footerPath + '.footerDescription',
    rules.Footer.footerDescription.max,
    true,
  );
  const holder = text(
    footer.copyrightHolder,
    footerPath + '.copyrightHolder',
    rules.Footer.copyrightHolder.max,
  );
  const companies = connection(
    footer.footerCompanies,
    footerPath + '.footerCompanies',
    rules.Footer.footerCompanies.max,
  ).map((value, index) => {
    const p = footerPath + '.footerCompanies.nodes[' + index + ']';
    const node = record(value, p);
    const id = text(node.id, p + '.id', 0, true);
    const title = text(node.title, p + '.title', 0, true);
    text(node.slug, p + '.slug');
    const fields = record(
      node.blooikosCompanyFields,
      p + '.blooikosCompanyFields',
    );
    const name =
      text(
        fields.shortName,
        p + '.blooikosCompanyFields.shortName',
        rules.CompanyIdentityFields.shortName.max,
      ) || title;
    let link: Omit<SiteLink, 'id'> | undefined;
    if (!absent(fields.cta)) {
      const cp = p + '.blooikosCompanyFields.cta';
      const cta = record(fields.cta, cp);
      link = {
        label: text(cta.title, cp + '.title', 0, true),
        href: destination(cta.url, cp + '.url'),
        target: target(cta.target, cp + '.target'),
      };
    }
    return { id, name, link };
  });
  if (!absent(contact.contactCompany)) {
    const edge = record(
      contact.contactCompany,
      contactPath + '.contactCompany',
    );
    if (!Object.hasOwn(edge, 'node')) issue(contactPath + '.contactCompany');
    else if (edge.node !== null) {
      const node = record(edge.node, contactPath + '.contactCompany.node');
      text(node.id, contactPath + '.contactCompany.node.id', 0, true);
      text(node.title, contactPath + '.contactCompany.node.title', 0, true);
    }
  }
  const phone = text(
    contact.phone,
    contactPath + '.phone',
    rules.SiteContact.phone.max,
  );
  if (
    phone &&
    (!/^[0-9 ()+\-]+$/.test(phone) ||
      !/^[0-9]{8,15}$/.test(phone.replace(/[ ()+\-]/g, '')))
  )
    issue(contactPath + '.phone');
  const email = text(
    contact.email,
    contactPath + '.email',
    rules.SiteContact.email.max,
  );
  if (
    email &&
    !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
      email,
    )
  )
    issue(contactPath + '.email');
  const instagram = text(
    contact.instagramUrl,
    contactPath + '.instagramUrl',
    rules.SiteContact.instagramUrl.max,
  );
  if (instagram) destination(instagram, contactPath + '.instagramUrl', true);
  const address = text(
    contact.address,
    contactPath + '.address',
    rules.SiteContact.address.max,
  );
  const primaryNavigation = menu(root.primaryMenu, 'data.primaryMenu');
  const footerNavigation = menu(root.footerMenu, 'data.footerMenu');
  if (issues.length || !logo) throw new PocValidationError(issues);
  return {
    brandName,
    logo,
    logoInverse,
    primaryNavigation,
    footerNavigation,
    description,
    companies,
    contacts: {
      phone: phone
        ? { label: phone, href: phoneDestination(phone) }
        : undefined,
      email: email
        ? {
            label: email,
            href: 'mailto:' + encodeURIComponent(email).replace('%40', '@'),
          }
        : undefined,
      instagram: instagram || undefined,
      address: address || undefined,
    },
    copyrightHolder: holder || brandName,
    year: copyrightYear(options.now),
  };
}
