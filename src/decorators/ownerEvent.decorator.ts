import { applyDecorators, UseGuards } from '@nestjs/common';
import { OwnerEventGuard } from '../guards/ownerEvent.guard';

export const OwnerEvent = () => {
  return applyDecorators(UseGuards(OwnerEventGuard));
};
