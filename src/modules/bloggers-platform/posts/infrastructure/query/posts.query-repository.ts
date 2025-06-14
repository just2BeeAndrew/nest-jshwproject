import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async getAllPosts(query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletedAt: null
    }

    const posts = await this.PostModel.find({filter})

    const totalCount = await this.PostModel.countDocuments(posts);

    const items = posts.map(PostsViewDto.mapToView)

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    })
  }

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
