import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '@/shared/i18n/i18nResources';
import { DEFAULT_LANGUAGE, DEFAULT_NS, NAMESPACES, SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';

const initPromise = i18n
  .use(initReactI18next)
  .init({
    resources,
    ns: NAMESPACES,
    defaultNS: DEFAULT_NS,
    lng: 'en',
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false
    }
  });

await initPromise;
