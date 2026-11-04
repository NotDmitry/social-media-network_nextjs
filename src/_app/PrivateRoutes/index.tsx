'use client';
import { redirect } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { t } = useT('authentication');
  const { authStatus } = useAuth();
  const language = useCurrentLanguage();

  if (authStatus === 'pending') {
    return <Spinner label={t(($) => $.session.permissions.loading)} />;
  }

  if (authStatus === 'authenticated') {
    return children;
  } else {
    redirect(getLocalizedPathname(language, ROUTES.signIn));
  }
}

export default PrivateRoutes;
