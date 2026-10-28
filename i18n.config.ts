import type { I18nConfig } from 'next-i18next/proxy';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, DEFAULT_NS, NAMESPACES } from '@/_app/i18n/i18nSettings';

const i18nConfig: I18nConfig = {
  supportedLngs: SUPPORTED_LANGUAGES,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: DEFAULT_NS,
  ns: [...NAMESPACES],
  resourceLoader: (language, namespace) => import(`@/_app/i18n/locales/${language}/${namespace}.json`),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default i18nConfig;
