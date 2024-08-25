import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), ConfigModule.forRoot()],
  controllers: [WishController],
  providers: [WishService],
})
export class WishModule {}
