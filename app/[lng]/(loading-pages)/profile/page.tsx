import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import ProfileInfoPage from '@/_pages/ProfileInfoPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';

export default async function Page({ params }: PageProps<'/[lng]/profile'>) {
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
