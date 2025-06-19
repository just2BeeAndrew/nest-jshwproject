import { Module } from '@nestjs/common';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { TestingService } from './application/testing.service';
import { TestingController } from './api/testing.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BloggersPlatformModule, UsersModule],
  controllers: [TestingController],
  providers: [TestingService],
  exports: []
})
export class TestingModule {}
