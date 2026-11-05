import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import SignInPage from '@/_pages/SignInPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';
import { getT } from '@/shared/i18n/i18n.server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('authentication');

  return {
    title: t(($) => $.signIn.meta.title),
    description: t(($) => $.signIn.meta.description),
  };
}

export default async function Page({ params }: PageProps<'/[lng]/sign-in'>) {
  const { lng } = await params;

  if (!isSupportedLanguage(lng)) {
    notFound();
  }

  return (
    <SignInPage
      homeNavLink={getLocalizedPathname(lng, ROUTES.home)}
      signUpNavLink={getLocalizedPathname(lng, ROUTES.signUp)}
    />
  );
}
