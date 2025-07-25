import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body';
import * as process from 'node:process';
import { DomainExceptionCode } from './domain-exception-codes';
import { DomainException } from '../domain-exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = exception.message || 'Unknown exception occurred.';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = DomainExceptionCode.InternalServerError;

    if (exception instanceof DomainException) {
      code = exception.code || DomainExceptionCode.InternalServerError;

      switch (code) {
        case DomainExceptionCode.Unauthorized:
          status = HttpStatus.UNAUTHORIZED;
          message = exception.message;
          break;
        case DomainExceptionCode.ValidationError:
          status = HttpStatus.UNAUTHORIZED;
          message = exception.message;
      }
    }

    const responseBody = this.buildResponseBody(request.url, message, code);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(
    requestUrl: string,
    message: string,
    code: DomainExceptionCode,
  ): ErrorResponseBody {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: code,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions: [],
      code: code,
    };
  }
}
