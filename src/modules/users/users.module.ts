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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BcryptModule
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersRepository, UsersQueryRepository, AuthService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
