import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WishService } from 'src/wish/wish.service';

@Injectable()
export class OwnerWishGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly wishService: WishService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const wishId = request.params.id as string;

    const wish = await this.wishService.findOne(wishId);

    return userId === wish?.user.id;
  }
}
