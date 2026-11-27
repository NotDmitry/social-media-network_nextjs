import { z } from 'zod';
import { dateTimeSchema, idSchema } from '@/shared/schemas';

const activitySchema = z.object({
  id: idSchema,
  creationDate: dateTimeSchema,
});

export const profileStatisticsSchema = z.object({
  mePosts: z.array(activitySchema),
  meLikes: z.array(activitySchema),
  meComments: z.array(activitySchema),
});

export const profileStatisticsResponseSchema = z.object({
  data: z.unknown().optional(),
  errors: z.array(z.unknown()).optional(),
})
