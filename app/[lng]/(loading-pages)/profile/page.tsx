import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import ProfileInfoPage from '@/_pages/ProfileInfoPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';
import { getT } from '@/shared/i18n/i18n.server';

type Props = PageProps<'/[lng]/profile'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT('profile');

  return {
    title: t(($) => $.info.meta.title),
    description: t(($) => $.info.meta.description),
    alternates: {
      canonical: `/${lng}/profile`,
    }
  };
}

export default async function Page({ params }: Props) {
  const { lng } = await params;

  if (!isSupportedLanguage(lng)) {
    notFound();
  }

  return (
    <ProfileInfoPage
      signInNavLink={getLocalizedPathname(lng, ROUTES.signIn)}
    />
  );
}
