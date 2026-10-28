'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';
import Header from '../Header';
import type { HeaderVariant } from '../Header/types';

function HeaderVariantPicker() {
  const pathname = usePathname();
  const { authStatus } = useAuth();
  const language = useCurrentLanguage();
  const profilePathname = getLocalizedPathname(language, ROUTES.profile);
  const statisticsPathname = getLocalizedPathname(language, ROUTES.statistics);

  let headerVariant: HeaderVariant = 'default';

  if (pathname === getLocalizedPathname(language, ROUTES.home)) {
    if (authStatus === 'authenticated') {
      headerVariant = 'user';
    } else if (authStatus === 'guest') {
      headerVariant = 'guest';
    }
  } else if (
    (pathname === profilePathname || pathname === statisticsPathname) &&
    authStatus === 'authenticated'
  ) {
    headerVariant = 'user';
  }

  return (
    <Header variant={headerVariant} />
  );
}

export default HeaderVariantPicker;
