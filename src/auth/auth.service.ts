import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGE } from '../helpers/errors';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  generateToken({ id, email }: AuthDto) {
    const secret = this.configService.get('JWT_SECRET');
    const _id = id;
    return this.jwtService.sign({ _id, email }, { secret });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne(loginDto.email);
    if (!bcrypt.compareSync(loginDto.password, user.password))
      throw new NotFoundException(ERROR_MESSAGE.INCOR_LOGIN_OR_PASSWORD);
    return user;
  }
}
