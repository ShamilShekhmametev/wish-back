import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hash;
    const user = this.usersRepository.save(createUserDto);
    return user;
  }

  async findOne(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  updateMe(email: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ email }, updateUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
