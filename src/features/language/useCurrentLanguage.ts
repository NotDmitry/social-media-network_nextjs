import { useParams } from 'next/navigation';
import { isSupportedLanguage } from './model';
import type { SupportedLanguage } from './model';

export function useCurrentLanguage(): SupportedLanguage {
  const { lng } = useParams<{ lng: string }>();

  if (!isSupportedLanguage(lng)) {
    throw new Error(`Unsupported language: ${lng}`);
  }

  return lng;
}
