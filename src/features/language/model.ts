export type SupportedLanguage = 'en' | 'ru';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ru'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isSupportedLanguage(language: unknown): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}

export function getLocalizedPathname(language: SupportedLanguage, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `/${language}${normalizedPath === '/' ? '' : normalizedPath}`;
}
