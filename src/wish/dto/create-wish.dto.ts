import { link } from 'fs';
import { z } from 'zod';
import { WishPriority } from '../entities/wish.entity';

export const createWishSchema = z
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

export type CreateWishDto = z.infer<typeof createWishSchema>;
