import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../../core/constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { Session, SessionModelType } from '../../domain/sessions.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { Types } from 'mongoose';

export class LoginCommand {
  constructor(
    public dto: { userId: string },
    public title: string,
    public ip: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessTokenJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshTokenJwtService: JwtService,
    @InjectModel(Session.name) private readonly SessionModel: SessionModelType,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sessionId = new Types.ObjectId();

    const accessToken = this.accessTokenJwtService.sign({
      id: command.dto.userId,
    });

    const refreshToken = this.refreshTokenJwtService.sign({
      id: command.dto.userId,
      sessionId: sessionId.toString(),
    });

    const { iat, exp } = this.refreshTokenJwtService.decode(refreshToken);

    const newSession = this.SessionModel.createInstance({
      sessionId: sessionId,
      userId: command.dto.userId,
      title: command.title,
      ip: command.ip,
      iat: iat,
      exp: exp,
    });
    await this.sessionsRepository.save(newSession);

    return { accessToken, refreshToken };
  }
}
