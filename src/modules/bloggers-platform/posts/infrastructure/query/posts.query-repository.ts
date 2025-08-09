import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { LikeStatus } from '../../../../../core/dto/like-status';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getPostById(id: string): Promise<PostsViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostsViewDto.mapToView(post, LikeStatus.None);
  }

  async getByIdOrNotFoundFail(
    id: string,
    status: LikeStatus,
  ): Promise<PostsViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostsViewDto.mapToView(post, status);
  }
}
