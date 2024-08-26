import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventService } from '../event/event.service';

@Injectable()
export class OwnerEventGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventService: EventService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const wishId = request.params.id as string;

    const event = await this.eventService.findOne(wishId);

    return userId === event?.user.id;
  }
}
