import { z } from 'zod';
import { profileStatisticsSchema } from './schema';

export type ProfileStatisticsQueryData = z.output<typeof profileStatisticsSchema>;

export interface Activity {
  creationDate: string;
}
