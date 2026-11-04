import { z } from 'zod';

interface PasswordConfirmationFormSchemaMessages {
  passwordRequired: string;
}

export function createPasswordConfirmationFormSchema({ passwordRequired }: PasswordConfirmationFormSchemaMessages) {
  return z.object({
    currentPassword: z.string()
      .nonempty({
        error: passwordRequired,
      }),
  });
}

export type PasswordConfirmationFormFields = z.input<ReturnType<typeof createPasswordConfirmationFormSchema>>;
