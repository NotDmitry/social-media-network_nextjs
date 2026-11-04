'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useT } from 'next-i18next/client';
import SignInForm from '@/features/SignInForm';

interface SignInPageProps {
  homeNavLink: string;
  signUpNavLink: string;
}

function SignInPage({ homeNavLink, signUpNavLink }: SignInPageProps) {
  const { t } = useT('authentication');
  const router = useRouter();

  function handleSignInSubmit() {
    router.push(homeNavLink);
  }

  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>{t(($) => $.signIn.title)}</h1>
        <p className='auth-page-text'>
          {t(($) => $.signIn.description.main)}
          <span>{t(($) => $.signIn.description.postfix)}</span>
        </p>
      </div>
      <SignInForm onSubmit={handleSignInSubmit} />
      <p className='auth-page-text'>
        {t(($) => $.signIn.prompt)}{' '}
        <Link className='auth-page-link' href={signUpNavLink}>
          {t(($) => $.signIn.link)}
        </Link>
      </p>
    </div>
  );
}

export default SignInPage;
