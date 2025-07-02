import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import {Request, Response} from 'express';
import { ErrorResponseBody } from './error-response-body';
import * as process from 'node:process';
import { DomainExceptionCode } from './domain-exception-codes';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message || 'Unknown exception occurred.';
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = this.buildResponseBody(request.url, message)

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string):ErrorResponseBody {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: DomainExceptionCode.InternalServerError,
      };
    }
  }
}