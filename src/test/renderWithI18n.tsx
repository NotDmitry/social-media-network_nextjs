import { render } from 'vitest-browser-react';
import { I18nProvider } from 'next-i18next/client';
import { resources } from '@/shared/i18n/i18nResources';
import { DEFAULT_LANGUAGE } from '@/shared/i18n/i18nSettings';

export function renderWithI18n(ui: React.ReactNode) {
  return render(
    <I18nProvider language={DEFAULT_LANGUAGE} resources={resources}>
      {ui}
    </ I18nProvider>
  );
}
