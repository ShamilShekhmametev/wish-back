import { z } from 'zod';
import { WishPriority } from '../entities/wish.entity';

export const updateWishSchema = z
  .object({
    name: z.string(),
    event: z.string(),
    reserved: z.boolean(),
    link: z.string().url(),
    price: z.number().gte(0),
    emoji: z.string().emoji(),
    priority: z.nativeEnum(WishPriority),
  })
  .required();

export type UpdateWishDto = z.infer<typeof updateWishSchema>;
