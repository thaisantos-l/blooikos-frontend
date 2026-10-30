import { contentObject as object, contentText as text } from './normalize';

export interface IndicatorsContent {
  eyebrow: string;
  title: string;
  items: { value: string; label: string; description: string }[];
}

export function normalizeIndicators(data: unknown): IndicatorsContent {
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeIndicators)
      : {};
  const items = (Array.isArray(fields.items) ? fields.items : [])
    .map((value) => {
      const item = object(value);
      return {
        value: text(item.value),
        label: text(item.label),
        description: text(item.description),
      };
    })
    .filter((item) => item.value || item.label || item.description)
    .slice(0, 4);
  return { eyebrow: text(fields.eyebrow), title: text(fields.title), items };
}
