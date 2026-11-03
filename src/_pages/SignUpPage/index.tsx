'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useT } from 'next-i18next/client';
import SignUpForm from '@/features/SignUpForm';

interface SignUpPageProps {
  homeNavLink: string;
  signInNavLink: string;
}

function SignUpPage({ homeNavLink, signInNavLink }: SignUpPageProps) {
  const { t } = useT('authentication');
  const router = useRouter();

  function handleSignUpSubmit() {
    router.push(homeNavLink);
  }

  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>{t(($) => $.signUp.title)}</h1>
        <p className='auth-page-text'>
          {t(($) => $.signUp.description.main)}
          <span>{t(($) => $.signUp.description.postfix)}</span>
        </p>
      </div>
      <SignUpForm onSubmit={handleSignUpSubmit} />
      <p className='auth-page-agreement-text'>
        {t(($) => $.signUp.agreement.prefix)}{' '}
        <a
          className='auth-page-external-link'
          href='https://policies.google.com/terms'
          target='_blank'
          rel='noreferrer'
        >
          {t(($) => $.signUp.agreement.terms)}
        </a>
        {' '}{t(($) => $.signUp.agreement.conjunction)}{' '}
        <a
          className='auth-page-external-link'
          href='https://policies.google.com/privacy'
          target='_blank'
          rel='noreferrer'
        >
          {t(($) => $.signUp.agreement.policy)}
        </a>
      </p>
      <p className='auth-page-text'>
        {t(($) => $.signUp.prompt)}{' '}
        <Link className='auth-page-link' href={signInNavLink}>
          {t(($) => $.signUp.link)}
        </Link>
      </p>
    </div>
  );
}

export default SignUpPage;
