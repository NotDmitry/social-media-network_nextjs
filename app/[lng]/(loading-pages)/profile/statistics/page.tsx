import type { Metadata } from 'next';
import { getT } from '@/shared/i18n/i18n.server';

type Props = PageProps<'/[lng]/profile/statistics'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getT('profile');

  return {
    title: t(($) => $.statistics.meta.title),
    description: t(($) => $.statistics.meta.description),
    alternates: {
      canonical: `/${lng}/profile/statistics`,
    }
  };
}

export { default } from '@/_pages/ProfileStatisticsPage';
