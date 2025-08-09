import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Status, StatusModelType } from '../../../comments/domain/status.entity';
import { FilterQuery } from 'mongoose';
import { Post, PostModelType } from '../../domain/posts.entity';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { Category } from '../../../../../core/dto/category';

export class GetAllPostsQuery {
  constructor(
    public userId: string,
    public query: GetPostsQueryParams,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler implements IQueryHandler<GetAllPostsQuery, PaginatedViewDto<PostsViewDto[]>> {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    @InjectModel(Status.name) private readonly StatusModel: StatusModelType,
  ) {
  }

  async execute(
    query: GetAllPostsQuery,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletedAt: null,
    };

    const posts = await this.PostModel.find(filter)
      .sort({ [query.query.sortBy]: query.query.sortDirection })
      .skip(query.query.calculateSkip())
      .limit(query.query.pageSize);

    let statusMap = new Map<string, LikeStatus>();

    if(query.userId) {
      const postIds = posts.map(p => p._id.toString());
      const statuses = await this.StatusModel.find({
        userId: query.userId,
        categoryId: { $in: postIds },
        category: Category.Post,
      });

      statusMap = statuses.reduce((map, status) => {
        map.set(status.categoryId.toString(), status.status);
        return map;
      }, new Map<string, LikeStatus>());
    }

    const totalCount = await this.PostModel.countDocuments(posts);

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
