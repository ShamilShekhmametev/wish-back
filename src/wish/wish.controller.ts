import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  Req,
} from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { FindWishDto } from './dto/find-wish.dto';
import { RESPONSE_MESSAGES } from '../helpers/messages';
import { User } from '../user/entities/user.entity';
import { OwnerWish } from 'src/decorators/ownerWish.decorator';

@Controller('wish')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req: Request & { user: User },
  ) {
    const { user } = req;
    try {
      await this.wishService.create(createWishDto, user.id);
      return {
        status: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.WISH_CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async find(@Query() findWishDto: FindWishDto) {
    try {
      const wishes = await this.wishService.find(findWishDto);
      return {
        status: HttpStatus.OK,
        data: wishes,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @OwnerWish()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    try {
      await this.wishService.update(id, updateWishDto);
      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.WISH_UPDATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @OwnerWish()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.wishService.remove(id);
      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.WISH_DELETED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
