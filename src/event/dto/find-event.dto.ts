import { z } from 'zod';

export const findEventSchema = z
  .object({
    name: z.string(),
    date: z.date(),
    user: z.string().uuid(),
  })
  .required();

export type FindEventDto = z.infer<typeof findEventSchema>;
