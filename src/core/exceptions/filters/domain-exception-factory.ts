import { DomainExceptionCode } from './domain-exception-codes';
import { DomainException, Extension } from '../domain-exception';

type DomainExceptionParams = {
  code: DomainExceptionCode;
  message: string;
  extensions?: Extension[];
};

export class DomainExceptionFactory {
  static create(params: DomainExceptionParams): DomainException {
    return new DomainException({
      code: params.code,
      message: params.message,
      extensions: params.extensions || [],
    });
  }

  static notFound(entity: string, key?: string): DomainException {
    return this.create({
      code: DomainExceptionCode.NotFound,
      message: `Not Found`,
      extensions: [
        new Extension(`${entity}`, key || entity.toLowerCase()),
      ],
    });
  }

  static unauthorized(message = 'Unauthorized', key?: string): DomainException {
    return this.create({
      code: DomainExceptionCode.Unauthorized,
      message,
      extensions: [new Extension(message, key || 'unauthorized')],
    });
  }

  static badRequest(message: string, key?: string): DomainException {
    return this.create({
      code: DomainExceptionCode.BadRequest,
      message,
      extensions: [new Extension(message, key || 'badRequest')],
    });
  }

  static forbidden(message: string, key?: string): DomainException {
    return this.create({
      code: DomainExceptionCode.Forbidden,
      message,
      extensions: [new Extension(message, key || 'forbidden')],
    });
  }
}
