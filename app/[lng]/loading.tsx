import { getT } from '@/shared/i18n/i18n.server';
import Spinner from '@/shared/ui/Spinner';

export default async function Loading() {
  const { t } = await getT('common');

  return (
    <Spinner label={t(($) => $.data.loading)} />
  );
}
