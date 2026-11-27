import { SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';
import type { SupportedLanguage } from '@/shared/i18n/i18nSettings';

/**
 * Returns whether an unknown value matches a locale-in-path route's language code.
 * @param language A value to match against URL locale.
 */
export function isSupportedLanguage(language: unknown): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}

/**
 * Returns a locale-in-path route constructed from language code and unprefixed path.
 * Adds a leading slash when missing and omits the trailing slash for the locale root.
 * @param language The supported language code to utilize as a locale prefix.
 */
export function getLocalizedPathname(language: SupportedLanguage, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `/${language}${normalizedPath === '/' ? '' : normalizedPath}`;
}
