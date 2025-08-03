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
import {
  Comment,
  CommentModelType,
} from '../../bloggers-platform/comments/domain/comments.entity';
import { Status, StatusModelType } from '../../bloggers-platform/comments/domain/status.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(Status.name) private StatusModel: StatusModelType,
  ) {}

  async deleteAll() {
    await Promise.all([
      this.BlogModel.clean(),
      this.PostModel.clean(),
      this.UserModel.clean(),
      this.CommentModel.clean(),
      this.StatusModel.clean(),
    ]);
  }
}
