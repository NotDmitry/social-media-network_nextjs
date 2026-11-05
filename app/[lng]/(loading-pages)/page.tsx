import type { Metadata } from 'next';
import HomePage from '@/_pages/HomePage';
import { getT } from '@/shared/i18n/i18n.server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('homePage');

  return {
    title: t(($) => $.meta.title),
    description: t(($) => $.meta.description),
  };
}

export default function Home() {
  return (
    <HomePage />
  );
}
