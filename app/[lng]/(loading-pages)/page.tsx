import type { Metadata } from 'next';
import HomePage from '@/_pages/HomePage';
import { getT } from '@/shared/i18n/i18n.server';

type Props = PageProps<'/[lng]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT('homePage');

  return {
    title: t(($) => $.meta.title),
    description: t(($) => $.meta.description),
    alternates: {
      canonical: `/${lng}`,
    }
  };
}

export default function Home() {
  return (
    <HomePage />
  );
}
