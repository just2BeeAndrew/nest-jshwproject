import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { UsersController } from './modules/users/api/users.controller';
import { BcryptModule } from './modules/bcrypt/bcrypt.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { BlogsController } from './modules/bloggers-platform/blogs/api/blogs.controller';
import { BlogsService } from './modules/bloggers-platform/blogs/application/blogs.service';
import { PostsController } from './modules/bloggers-platform/posts/api/posts.controller';
import { PostsService } from './modules/bloggers-platform/posts/application/posts.service';
import { TestingController } from './modules/testing/api/testing.controller';
import { TestingService } from './modules/testing/application/testing.service';
import { TestingModule } from './modules/testing/testing.module';
import { CommentsController } from './modules/bloggers-platform/comments/api/comments.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://user1:password1@91.108.243.169:27017/mydb1?authSource=mydb1'),
    UsersModule,
    BcryptModule,
    BloggersPlatformModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
