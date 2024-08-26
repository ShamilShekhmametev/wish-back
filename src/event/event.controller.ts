import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../user/entities/user.entity';
import { RESPONSE_MESSAGES } from '../helpers/messages';
import { FindEventDto } from './dto/find-event.dto';
import { OwnerEvent } from 'src/decorators/ownerEvent.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: Request & { user: User },
  ) {
    const { user } = req;
    try {
      await this.eventService.create(createEventDto, user.id);
      return {
        status: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.EVENT_CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async find(@Query() findEventDto: FindEventDto) {
    try {
      const events = await this.eventService.find(findEventDto);
      return {
        status: HttpStatus.OK,
        data: events,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @OwnerEvent()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      await this.eventService.update(id, updateEventDto);
      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.EVENT_UPDATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @OwnerEvent()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.eventService.remove(id);
      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.EVENT_DELETED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
