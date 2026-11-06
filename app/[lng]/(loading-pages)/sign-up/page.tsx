import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import SignUpPage from '@/_pages/SignUpPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';
import { getT } from '@/shared/i18n/i18n.server';

type Props = PageProps<'/[lng]/sign-up'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT('authentication');

  return {
    title: t(($) => $.signUp.meta.title),
    description: t(($) => $.signUp.meta.description),
    alternates: {
      canonical: `/${lng}/sign-up`,
    }
  };
}

export default async function Page({ params }: Props) {
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
