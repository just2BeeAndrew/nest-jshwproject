import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../../core/constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exception-codes';

export class RefreshTokenCommand {
  constructor(
    public userId: string,
    public sessionId: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessTokenJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshTokenJwtService: JwtService,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<{accessToken: string, refreshToken: string}> {
    const session = await this.sessionsRepository.findSessionById(
      command.sessionId,
    );
    if (!session) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{message: "Session not found", key: "session"}]
      });
    }

    const accessToken = this.accessTokenJwtService.sign({
      id: command.userId,
    });

    const refreshToken = this.refreshTokenJwtService.sign({
      id: command.userId,
      sessionId: command.sessionId,
    });

    const refreshPayload = this.refreshTokenJwtService.decode(refreshToken);

    session.setSession(refreshPayload.iat, refreshPayload.exp);
    await this.sessionsRepository.save(session)

    return {accessToken, refreshToken};
  }
}
