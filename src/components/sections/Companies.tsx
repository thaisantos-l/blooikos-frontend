import type { CompaniesContent } from '../../lib/site/normalize-companies';
import { CompanySection } from './CompanySection';

export function Companies({ companies }: { companies: CompaniesContent }) {
  return (
    <div id="empresas" tabIndex={-1}>
      {companies.items.map((company, index) => (
        <CompanySection
          key={`${company.id}-${index}`}
          company={company}
          headingId={`featured-company-heading-${index + 1}`}
          imageSide={index % 2 ? 'left' : 'right'}
          tone={index % 2 ? 'light' : 'muted'}
        />
      ))}
    </div>
  );
}
