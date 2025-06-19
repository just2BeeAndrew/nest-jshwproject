import { Injectable } from '@nestjs/common';
import { BlogModelType } from '../../bloggers-platform/blogs/domain/blogs.entity';
import { PostModelType } from '../../bloggers-platform/posts/domain/posts.entity';
import { UserModelType } from '../../users/domain/users.entity';

@Injectable()
export class TestingService {
  constructor(
    private BlogModel: BlogModelType,
    private PostModel: PostModelType,
    private UserModel: UserModelType,
  ) {}

  async deleteAll(){
    await this.BlogModel.clean();
    await this.PostModel.clean();
    await this.UserModel.clean();
  }
}
