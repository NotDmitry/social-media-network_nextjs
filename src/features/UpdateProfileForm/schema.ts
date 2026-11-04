import { z } from 'zod';
import { createEmailSchema, createUsernameSchema, descriptionSchema } from '@/shared/schemas';

interface UpdateProfileFormSchemaMessages {
  descriptionMaxLength: string;
  invalidEmail: string;
  usernameRequired: string;
}

export function createUpdateProfileFormSchema({
  descriptionMaxLength,
  invalidEmail,
  usernameRequired
}: UpdateProfileFormSchemaMessages) {
  return z.object({
    username: createUsernameSchema(usernameRequired),
    email: createEmailSchema(invalidEmail),
    description: descriptionSchema.max(200, {
      error: descriptionMaxLength,
    }),
  });
}

export type UpdateProfileFormFields = z.input<ReturnType<typeof createUpdateProfileFormSchema>>;
