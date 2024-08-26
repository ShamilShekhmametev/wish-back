import { z } from 'zod';

export const createEventSchema = z
  .object({
    name: z.string(),
    date: z.date(),
    emoji: z.string().emoji(),
  })
  .required();

export type CreateEventDto = z.infer<typeof createEventSchema>;
