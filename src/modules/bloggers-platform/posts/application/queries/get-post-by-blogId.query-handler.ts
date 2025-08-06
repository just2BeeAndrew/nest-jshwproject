import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query/blogs.query-repository';
import { FilterQuery } from 'mongoose';
import { LikeStatus } from '../../../../../core/dto/like-status';
import {
  Status,
  StatusModelType,
} from '../../../comments/domain/status.entity';
import { Category } from '../../../../../core/dto/category';

export class GetPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: GetPostsQueryParams,
    public userId: string,
  ) {}
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdQueryHandler
  implements
    IQueryHandler<GetPostsByBlogIdQuery, PaginatedViewDto<PostsViewDto[]>>
{
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Status.name) private readonly StatusModel: StatusModelType,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(
    query: GetPostsByBlogIdQuery,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const blog = await this.blogsQueryRepository.getBlogByIdOrNotFoundFail(
      query.blogId,
    );
    const filter: FilterQuery<Post> = {
      blogId: query.blogId,
      deletedAt: null,
    };

    const posts = await this.PostModel.find(filter)
      .sort({ [query.query.sortBy]: query.query.sortDirection })
      .skip(query.query.calculateSkip())
      .limit(query.query.pageSize);

    let statusMap = new Map<string, LikeStatus>();

    if (query.userId) {
      const postIds = posts.map((p) => p._id.toString());
      const statuses = await this.StatusModel.find({
        userId: query.userId,
        categoryId: { $in: postIds },
        category: Category.Post,
      });

      for (const status of statuses) {
        statusMap.set(status.categoryId.toString(), status.status);
      }
    }

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map((post) =>
      PostsViewDto.mapToView(
        post,
        statusMap.get(post._id.toString()) ?? LikeStatus.None,
      ),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.query.pageNumber,
      size: query.query.pageSize,
    });
  }
}
