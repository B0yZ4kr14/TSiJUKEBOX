import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

export type Language = 'pt-BR' | 'en' | 'es';

export const languages: Record<Language, { name: string; flag: string }> = {
  'pt-BR': { name: 'Português (Brasil)', flag: '🇧🇷' },
  'en': { name: 'English', flag: '🇺🇸' },
  'es': { name: 'Español', flag: '🇪🇸' },
};

export const translations: Record<Language, typeof ptBR> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
};

export type TranslationKeys = typeof ptBR;

export function getTranslation(language: Language): TranslationKeys {
  return translations[language] || translations['pt-BR'];
}

export function t(language: Language, path: string): string {
  const translation = getTranslation(language);
  const keys = path.split('.');
  let result: unknown = translation;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}
