'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { ROUTES } from '@/_app/routes';
import Header from '../Header';
import type { HeaderVariant } from '../Header/types';

function HeaderVariantPicker() {
  const pathname = usePathname();
  const { authStatus } = useAuth();

  let headerVariant: HeaderVariant = 'default';

  if (pathname === ROUTES.home) {
    if (authStatus === 'authenticated') {
      headerVariant = 'user';
    } else if (authStatus === 'guest') {
      headerVariant = 'guest';
    }
  } else if ((pathname === ROUTES.profile || pathname === ROUTES.statistics) && authStatus === 'authenticated') {
    headerVariant = 'user';
  }

  return (
    <Header variant={headerVariant} />
  );
}

export default HeaderVariantPicker;
