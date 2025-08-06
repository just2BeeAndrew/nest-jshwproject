import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentByIdQueryHandler } from '../../../comments/application/queries/get-comments-by-id.query-handler';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query/blogs.query-repository';
import { FilterQuery } from 'mongoose';

export class GetPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: GetPostsQueryParams,
    userId: string
  ) {}
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdQueryHandler
  implements
    IQueryHandler<GetPostsByBlogIdQuery, PaginatedViewDto<PostsViewDto[]>>
{
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(query: GetPostsByBlogIdQuery): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const blog =
      await this.blogsQueryRepository.getBlogByIdOrNotFoundFail(query.blogId);
    const filter: FilterQuery<Post> = {
      blogId: query.blogId,
      deletedAt: null,
    };

    const posts = await this.PostModel.find(filter)
      .sort({ [query.query.sortBy]: query.query.sortDirection })
      .skip(query.query.calculateSkip())
      .limit(query.query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map(PostsViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.query.pageNumber,
      size: query.query.pageSize,
    });
  }
}
