import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  DomainException,
  Extension,
} from '../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../core/exceptions/filters/domain-exception-codes';

export const errorFormatter = (
  error: ValidationError[],
  errorMessage?: any,
): Extension[] => {
  const errorsForResponse = errorMessage || [];
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);

        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: formattedErrors,
        });
      },
    }),
  );
}