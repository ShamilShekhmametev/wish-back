import { z } from 'zod';

export const updateEventSchema = z
  .object({
    name: z.string(),
    date: z.date(),
    emoji: z.string().emoji(),
  })
  .required();

export type UpdateEventDto = z.infer<typeof updateEventSchema>;
