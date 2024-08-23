import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const zodError = error as ZodError;
      const response: Record<string, any> = { status: HttpStatus.BAD_REQUEST };
      zodError.errors.forEach((error) => {
        response[error.path[0]] = error.message;
      });

      throw new HttpException(response, HttpStatus.BAD_REQUEST);
    }
  }
}
