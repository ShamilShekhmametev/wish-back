import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { FindWishDto } from './dto/find-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: string) {
    const wish = await this.wishesRepository.save({
      name: createWishDto.name,
      event: { id: createWishDto.event },
      reserved: createWishDto.reserved,
      link: createWishDto.link,
      price: createWishDto.price,
      emoji: createWishDto.emoji,
      priority: createWishDto.priority,
      user: { id: userId },
    });
    return wish;
  }

  async find(findWishDto: FindWishDto) {
    const wishes = await this.wishesRepository.find({
      where: {
        name: findWishDto.name,
        event: { id: findWishDto.event },
        reserved: findWishDto.reserved,
        user: { id: findWishDto.user },
      },
    });
    return wishes;
  }

  async findOne(id: string) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['user'],
      select: { user: { id: true } },
    });
    return wish;
  }

  update(id: string, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update(
      { id },
      {
        name: updateWishDto.name,
        event: { id: updateWishDto.event },
        reserved: updateWishDto.reserved,
        link: updateWishDto.link,
        price: updateWishDto.price,
        emoji: updateWishDto.emoji,
        priority: updateWishDto.priority,
      },
    );
  }

  remove(id: string) {
    return this.wishesRepository.delete({ id });
  }
}
