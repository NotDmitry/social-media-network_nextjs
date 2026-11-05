import { z } from 'zod';

interface CreatePostFormSchemaMessages {
  descriptionMaxLength: string;
  descriptionRequired: string;
  titleMaxLength: string;
  titleRequired: string;
}

export function createPostFormSchema({
  descriptionMaxLength,
  descriptionRequired,
  titleMaxLength,
  titleRequired,
}: CreatePostFormSchemaMessages) {
  return z.object({
    title: z.string()
      .trim()
      .nonempty({
        error: titleRequired,
      })
      .max(80, {
        error: titleMaxLength,
      }),
    description: z.string()
      .trim()
      .nonempty({
        error: descriptionRequired,
      })
      .max(500, {
        error: descriptionMaxLength,
      }),
  });

}
export type CreatePostFormFields = z.input<ReturnType<typeof createPostFormSchema>>;
