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

const useCases = [LoginUseCase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BcryptModule,
    NotificationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10_000,
        limit: 5,
      },
    ]),
    CqrsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    ...useCases,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret',
          signOptions: { expiresIn: '23h' },
        });
      },
      inject: [],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret',
          signOptions: { expiresIn: '1d' },
        });
      },
      inject: [],
    },
  ],
  exports: [UsersService, UsersRepository, MongooseModule],
})
export class UsersModule {}
