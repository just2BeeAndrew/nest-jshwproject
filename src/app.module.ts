import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { UsersController } from './modules/users/api/users.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://user1:password1@91.108.243.169:27017/mydb1?authSource=mydb1'),
    UsersModule,
  ],
  controllers: [AppController,UsersController],
  providers: [AppService],
})
export class AppModule {}
