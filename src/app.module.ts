import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://user1:password1@91.108.243.169:27017/mydb1?authSource=mydb1'),],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, UsersRepository],
})
export class AppModule {}
