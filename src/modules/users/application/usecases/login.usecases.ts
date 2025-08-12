import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../../core/constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { Session, SessionModelType } from '../../domain/sessions.entity';
import { InjectModel } from '@nestjs/mongoose';

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
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.accessTokenJwtService.sign({
      id: command.dto.userId,
    });

    const refreshToken = this.refreshTokenJwtService.sign({
      id: command.dto.userId,
    });

    const { iat, exp } = this.refreshTokenJwtService.decode(refreshToken);

    const newSession = this.SessionModel.createInstance({
      userId: command.dto.userId,
      title: command.title,
      ip: command.ip,
      iat: iat,
      exp: exp,
    });

    return { accessToken, refreshToken };
  }
}
