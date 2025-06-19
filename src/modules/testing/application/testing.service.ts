import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogModelType,
} from '../../bloggers-platform/blogs/domain/blogs.entity';
import {
  Post,
  PostModelType,
} from '../../bloggers-platform/posts/domain/posts.entity';
import { User, UserModelType } from '../../users/domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  async deleteAll() {
    await Promise.all([
      this.BlogModel.clean(),
      this.PostModel.clean(),
      this.UserModel.clean(),
    ]);
  }
}
