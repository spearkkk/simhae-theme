export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'ko';
}
export function resolveLocale(header: string, preference?: string): Locale {
  if (preference && isLocale(preference)) return preference;
  const choices = header.split(',').map((entry, index) => {
    const [tag, ...params] = entry.trim().split(';');
    const weight = params.find(p => p.trim().startsWith('q='));
    const q = weight ? Number(weight.trim().slice(2)) : 1;
    return {language: tag.toLowerCase().split('-')[0], q, index};
  }).filter(item => Number.isFinite(item.q) && item.q > 0 && item.q <= 1)
    .sort((a,b) => b.q - a.q || a.index - b.index);
  for (const item of choices) if (isLocale(item.language)) return item.language;
  return 'en';
}
