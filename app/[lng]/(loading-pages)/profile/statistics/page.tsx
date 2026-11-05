import type { Metadata } from 'next';
import { getT } from '@/shared/i18n/i18n.server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('profile');

  return {
    title: t(($) => $.statistics.meta.title),
    description: t(($) => $.statistics.meta.description),
  };
}

export { default } from '@/_pages/ProfileStatisticsPage';
