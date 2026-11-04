export type SupportedLanguage = 'en' | 'ru';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ru'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const DEFAULT_NS = 'common';
export const NAMESPACES = [
  'common',
  'errorPage',
  'authentication',
  'homePage',
  'posts',
  'profile',
] as const;
