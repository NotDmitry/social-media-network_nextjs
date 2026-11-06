import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import SignInPage from '@/_pages/SignInPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';
import { getT } from '@/shared/i18n/i18n.server';

type Props = PageProps<'/[lng]/sign-in'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT('authentication');

  return {
    title: t(($) => $.signIn.meta.title),
    description: t(($) => $.signIn.meta.description),
    alternates: {
      canonical: `/${lng}/sign-in`,
    }
  };
}

export default async function Page({ params }: Props) {
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
