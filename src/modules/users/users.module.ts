import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../../core/guards/local/local.strategy';
import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../core/constants/auth-tokens.inject-constants';
import { LoginUseCase } from './application/usecases/login.usecases';
import { CqrsModule } from '@nestjs/cqrs';
import { Session, SessionSchema } from './domain/sessions.entity';
import { SessionsRepository } from './infrastructure/sessions.repository';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase';
import { LogoutUseCase } from './application/usecases/logout.usecase';
import { SessionsController } from './api/sessions.controller';
import { DeleteSessionByIdUseCase } from './application/usecases/delete-session-by-id.usecase';
import { DeleteSessionsExcludeCurrentUseCase } from './application/usecases/delete-sessions-exclude-current.usecase';
import { JwtRefreshStrategy } from '../../core/guards/bearer/jwt-refresh.strategy';
import { GetAllSessionsQueryHandler } from './application/queries/get-all-sessions.query-heandler';
import { SessionsQueryRepository } from './infrastructure/query/session.query-repository';

const useCases = [
  LoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  DeleteSessionByIdUseCase,
  DeleteSessionsExcludeCurrentUseCase,
];

const queries = [GetAllSessionsQueryHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),

    BcryptModule,
    NotificationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    CqrsModule,
  ],
  controllers: [UsersController, AuthController, SessionsController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    AuthQueryRepository,
    SessionsRepository,
    SessionsQueryRepository,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    ...useCases,
    ...queries,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret',
          signOptions: { expiresIn: 10 },
        });
      },
      inject: [],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret',
          signOptions: { expiresIn: 20 },
        });
      },
      inject: [],
    },
  ],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
