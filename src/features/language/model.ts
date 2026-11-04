import { SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';
import type { SupportedLanguage } from '@/shared/i18n/i18nSettings';

export function isSupportedLanguage(language: unknown): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}

export function getLocalizedPathname(language: SupportedLanguage, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `/${language}${normalizedPath === '/' ? '' : normalizedPath}`;
}
