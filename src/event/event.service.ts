import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { FindEventDto } from './dto/find-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}
  async create(createEventDto: CreateEventDto, userId: string) {
    const event = await this.eventsRepository.save({
      ...createEventDto,
      user: { id: userId },
    });
    return event;
  }

  async find(findEventDto: FindEventDto) {
    const events = await this.eventsRepository.find({
      where: {
        name: findEventDto.name,
        date: findEventDto.date,
        user: { id: findEventDto.user },
      },
    });
    return events;
  }

  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['user'],
      select: { user: { id: true } },
    });
    return event;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventsRepository.update(
      { id },
      {
        ...updateEventDto,
      },
    );
  }

  remove(id: string) {
    return this.eventsRepository.delete({ id });
  }
}
