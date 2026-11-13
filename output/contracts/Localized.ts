export interface LocalizedText {
  en: string;
  ar: string;
}

export type Lang = 'en' | 'ar';

export function pick(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return '';
  return text[lang] || text.en;
}