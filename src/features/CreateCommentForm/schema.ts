import { z } from 'zod';

interface CreateCommentFormSchemaMessages {
  commentMaxLength: string;
  commentRequired: string;
}

export function createCommentFormSchema({ commentMaxLength, commentRequired }: CreateCommentFormSchemaMessages) {
  return z.object({
    comment: z.string()
      .trim()
      .nonempty({
        error: commentRequired,
      })
      .max(200, {
        error: commentMaxLength,
      }),
  });
}

export type CreateCommentFormFields = z.input<ReturnType<typeof createCommentFormSchema>>;
