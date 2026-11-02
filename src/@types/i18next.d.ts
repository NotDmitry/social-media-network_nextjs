import { DEFAULT_NS } from '@/shared/i18n/i18nSettings';
import { resources } from '@/shared/i18n/i18nResources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NS;
    resources: typeof resources['en'];
    enableSelector: true;
  }
}
