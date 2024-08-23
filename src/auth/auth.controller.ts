import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.login(loginDto);
      const { id, email } = user;
      const token = this.authService.generateToken({ id, email });
      return {
        status: HttpStatus.OK,
        access_token: token,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
