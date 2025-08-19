import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainExceptionFactory } from '../../../../core/exceptions/filters/domain-exception-factory';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exception-codes';

export class DeleteSessionByIdCommand {
  constructor(
    public userId: string,
    public deviceId: string,
    public uriParam: string,
  ) {}
}

@CommandHandler(DeleteSessionByIdCommand)
export class DeleteSessionByIdUseCase
  implements ICommandHandler<DeleteSessionByIdCommand>
{
  constructor(private readonly sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionByIdCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.uriParam,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: "Not found",
        extensions:[{message:"device not found", key: "device"}]
      });
    }

    if (session.userId !== command.userId) {
      throw DomainExceptionFactory.forbidden('User is not owner', 'user');
    }

    session.softDelete();
    await this.sessionRepository.save(session);
  }
}
