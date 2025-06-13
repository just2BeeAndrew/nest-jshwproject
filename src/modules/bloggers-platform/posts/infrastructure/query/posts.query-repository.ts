import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { UsersViewDto } from '../../../../users/api/view-dto/users.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async getByIdOrNotFoundFail(id: string): Promise<PostsViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deleteAt: null,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostsViewDto.mapToView(post)
  }
}
