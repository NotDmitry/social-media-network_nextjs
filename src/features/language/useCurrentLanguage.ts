import { useParams } from 'next/navigation';
import type { SupportedLanguage } from '@/shared/i18n/i18nSettings';
import { isSupportedLanguage } from './model';

export function useCurrentLanguage(): SupportedLanguage {
  const { lng } = useParams<{ lng: string }>();

  if (!isSupportedLanguage(lng)) {
    throw new Error(`Unsupported language: ${lng}`);
  }

  return lng;
}
