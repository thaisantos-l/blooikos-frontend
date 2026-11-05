// Only a single number in the site's pt-BR format is animated. Other copy stays intact.
export function countValue(
  value: string,
): ((progress: number) => string) | null {
  const match = /^([^\d]*)(\d+(?:[.,]\d+)*)([^\d]*)$/.exec(value);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(number)) return null;

  const [integer, fraction = ''] = number.replaceAll('.', '').split(',');
  const target = Number(integer + fraction);
  if (!Number.isSafeInteger(target) || target === 0) return null;
  const padded = integer.startsWith('0') ? integer.length : 1;
  const grouped = number.includes('.');

  return (progress) => {
    if (progress >= 1) return value;
    const digits = String(Math.round(target * Math.max(0, progress))).padStart(
      fraction.length + padded,
      '0',
    );
    const whole = fraction ? digits.slice(0, -fraction.length) : digits;
    const formatted = grouped
      ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : whole;
    return `${prefix}${formatted}${fraction ? ',' + digits.slice(-fraction.length) : ''}${suffix}`;
  };
}
