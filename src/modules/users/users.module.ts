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
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../core/guards/local/local.strategy';
import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BcryptModule,
    NotificationsModule,
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '1h' },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10_000,
        limit: 5,
      },
    ]),
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
  ],
  exports: [UsersService,UsersRepository, MongooseModule],
})
export class UsersModule {}
