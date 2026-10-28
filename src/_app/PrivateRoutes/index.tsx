'use client';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();
  const language = useCurrentLanguage();

  if (authStatus === 'pending') {
    return <Spinner label='Checking permissions...' />;
  }

  if (authStatus === 'authenticated') {
    return children;
  } else {
    redirect(getLocalizedPathname(language, ROUTES.signIn));
  }
}

export default PrivateRoutes;
