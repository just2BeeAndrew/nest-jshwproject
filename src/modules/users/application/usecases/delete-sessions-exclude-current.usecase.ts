import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/sessions.entity';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainExceptionFactory } from '../../../../core/exceptions/filters/domain-exception-factory';

export class DeleteSessionsExcludeCurrentCommand {
  constructor(
    public userId: string,
    public sessionId: string,
  ) {}
}

@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
    private readonly sessionRepository: SessionsRepository
  ) {}

  async execute(command: DeleteSessionsExcludeCurrentCommand) {
    const session = await this.sessionRepository.findSessionById(command.sessionId);
    if (!session) {
      throw DomainExceptionFactory.notFound("session not found", "session");
    }

    if(session.userId !== command.userId) {
      throw DomainExceptionFactory.forbidden("User is not owner", "user");
    }

    await this.SessionModel.softDeleteSessionExcludeCurrent(command.userId, command.sessionId);
  }
}
