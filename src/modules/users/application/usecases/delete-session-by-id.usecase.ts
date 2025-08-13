import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainExceptionFactory } from '../../../../core/exceptions/filters/domain-exception-factory';

export class DeleteSessionByIdCommand {
  constructor(
    public userId: string,
    public sessionId: string,
  ) {}
}

@CommandHandler(DeleteSessionByIdCommand)
export class DeleteSessionByIdUseCase
  implements ICommandHandler<DeleteSessionByIdCommand>
{
  constructor(private readonly sessionRepository: SessionsRepository) {}

  async execute(command: DeleteSessionByIdCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.sessionId,
    );
    if (!session) {
      throw DomainExceptionFactory.notFound('Session not found.', 'session');
    }

    if (session.userId !== command.userId) {
      throw DomainExceptionFactory.forbidden('User is not owner', 'user');
    }

    session.softDelete();
    await this.sessionRepository.save(session);
  }
}
