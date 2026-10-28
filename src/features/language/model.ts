export type SupportedLanguage = 'en' | 'ru';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ru'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isSupportedLanguage(language: unknown): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}
