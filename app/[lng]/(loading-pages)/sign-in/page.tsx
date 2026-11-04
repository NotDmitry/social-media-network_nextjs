import { notFound } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import SignInPage from '@/_pages/SignInPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';

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
