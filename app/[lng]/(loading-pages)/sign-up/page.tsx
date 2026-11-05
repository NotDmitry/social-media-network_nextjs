import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import SignUpPage from '@/_pages/SignUpPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';
import { getT } from '@/shared/i18n/i18n.server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('authentication');

  return {
    title: t(($) => $.signUp.meta.title),
    description: t(($) => $.signUp.meta.description),
  };
}

export default async function Page({ params }: PageProps<'/[lng]/sign-up'>) {
  const { lng } = await params;

  if (!isSupportedLanguage(lng)) {
    notFound();
  }

  return (
    <SignUpPage
      homeNavLink={getLocalizedPathname(lng, ROUTES.home)}
      signInNavLink={getLocalizedPathname(lng, ROUTES.signIn)}
    />
  );
}
