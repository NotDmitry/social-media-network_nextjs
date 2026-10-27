'use client';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();

  if (authStatus === 'pending') {
    return <Spinner label='Checking permissions...' />;
  }

  if (authStatus === 'guest') {
    redirect(ROUTES.signIn)
  }

  return authStatus === 'authenticated' ? children : null;
}

export default PrivateRoutes;
