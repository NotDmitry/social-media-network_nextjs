import { DEFAULT_NS } from '@/_app/i18n/i18nSettings';
import { resources } from '@/_app/i18n/i18nResources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS;
    resources: typeof resources['en'];
    enableSelector: true;
  }
}
