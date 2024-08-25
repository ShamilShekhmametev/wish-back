import { z } from 'zod';

export const findWishSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    event: z.string(),
    user: z.string(),
    reserved: z.boolean(),
  })
  .required();

export type FindWishDto = z.infer<typeof findWishSchema>;
