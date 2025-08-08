import { GetCommentsByPostIdQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentsViewDto } from '../../../comments/api/view-dto/comments.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType,
} from '../../../comments/domain/comments.entity';
import {
  Status,
  StatusModelType,
} from '../../../comments/domain/status.entity';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { FilterQuery } from 'mongoose';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { Category } from '../../../../../core/dto/category';

export class GetCommentByPostIdQuery {
  constructor(
    public userId: string,
    public postId: string,
    public query: GetCommentsByPostIdQueryParams,
  ) {}
}

@QueryHandler(GetCommentByPostIdQuery)
export class GetCommentsByPostIdQueryHandler
  implements
    IQueryHandler<
      GetCommentByPostIdQuery,
      PaginatedViewDto<CommentsViewDto[]>
    >
{
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
    @InjectModel(Status.name) private readonly StatusModel: StatusModelType,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(
    query: GetCommentByPostIdQuery,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const post = await this.postsQueryRepository.getByIdOrNotFoundFail(
      query.postId,
    );

    const filter: FilterQuery<Comment> = {
      postId: query.postId,
      deletedAt: null,
    };

    const comments = await this.CommentModel.find(filter)
      .sort({ [query.query.sortBy]: query.query.sortDirection })
      .skip(query.query.calculateSkip())
      .limit(query.query.pageSize);

    let statusMap = new Map<string, LikeStatus>();

    if (query.userId) {
      const commentIds = comments.map((c) => c._id.toString());
      const statuses = await this.StatusModel.find({
        userId: query.userId,
        categoryId: { $in: commentIds },
        category: Category.Comment,
      });

      for (const status of statuses) {
        statusMap.set(status.categoryId.toString(), status.status);
      }
    }

    const totalCount = await this.CommentModel.countDocuments(filter)

    const items = comments.map((comment) =>
      CommentsViewDto.mapToView(
        comment,
        statusMap.get(comment._id.toString()) ?? LikeStatus.None,
      ),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.query.pageNumber,
      size: query.query.pageSize,
    })
  }
}
