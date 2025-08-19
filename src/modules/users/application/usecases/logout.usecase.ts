import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/sessions.entity';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainExceptionFactory } from '../../../../core/exceptions/filters/domain-exception-factory';

export class LogoutCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: SessionModelType,
    private readonly sessionRepository: SessionsRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const session = await this.sessionRepository.findSessionById(
      command.deviceId,
    );
    if (!session) {
      throw DomainExceptionFactory.notFound('Session not found', 'session');
    }

    session.softDelete();
    await this.sessionRepository.save(session);
  }
}
