import { applyDecorators, UseGuards } from '@nestjs/common';
import { OwnerWishGuard } from '../guards/ownerWish.guard';

export const OwnerWish = () => {
  return applyDecorators(UseGuards(OwnerWishGuard));
};
