import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpStatus,
  HttpException,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/zod.validation.pipe';
import { RESPONSE_MESSAGES } from 'src/helpers/messages';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { getUniqAvatarName, isUniqueEmailError } from './helpers/utils';
import { Public } from '../decorators/public.decorator';

@Controller('user')
export class UserController {
  private readonly dirImagesPath;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.dirImagesPath = this.configService.get('IMAGES_PATH');
  }

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.register(createUserDto);
      return {
        status: HttpStatus.CREATED,
        message: RESPONSE_MESSAGES.USER_REGISTERED,
      };
    } catch (error) {
      if (isUniqueEmailError(error))
        error.message = { email: 'Этот Email уже используется' };
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/me')
  async me(@Req() req: Request & { user: User }) {
    try {
      const { user } = req;
      const me = await this.userService.findOne(user.email);

      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.USER_FOUND,
        data: me,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('/me')
  async updateMe(
    @Req() req: Request & { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { user } = req;
    try {
      await this.userService.updateMe(user.email, updateUserDto);
      return {
        status: HttpStatus.OK,
        message: RESPONSE_MESSAGES.USER_UPDATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('updateAvatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { user: User },
  ) {
    try {
      const { user } = req;
      const path = getUniqAvatarName(this.dirImagesPath, file.originalname);

      const me = await this.userService.findOne(user.email);
      fs.writeFileSync(path, file.buffer);
      await this.userService.updateMe(user.email, { avatar: path });
      if (me.avatar && fs.existsSync(me.avatar)) fs.unlinkSync(me.avatar);

      return {
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.AVATAR_UPDATED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('deleteAvatar')
  async deleteAvatar(@Req() req: Request & { user: User }) {
    try {
      const { user } = req;

      const me = await this.userService.findOne(user.email);
      await this.userService.updateMe(user.email, { avatar: null });
      if (me.avatar && fs.existsSync(me.avatar)) fs.unlinkSync(me.avatar);

      return {
        statusCode: HttpStatus.OK,
        message: RESPONSE_MESSAGES.AVATAR_DELETED,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
