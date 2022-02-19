import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let httpStatus: number;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };

    response.status(httpStatus).json(responseBody);
  }
}
