import { configModule } from './dynamic-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BcryptModule } from './modules/bcrypt/bcrypt.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UsersModule,
    BcryptModule,
    BloggersPlatformModule,
    TestingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
