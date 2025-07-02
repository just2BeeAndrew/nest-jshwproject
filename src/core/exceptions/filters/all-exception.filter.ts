import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import {Request, Response} from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message || 'Unknown exception occurred.';
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = this.buildResponseBody(request.url, message)
  }

  private buildResponseBody(requestUrl: string, message: string) {}
}