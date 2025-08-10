import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { Category } from '../../../../../core/dto/category';

export class GetCommentByIdQuery {
  constructor(
    public commentid: string,
    public userId?: string | null,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler
  implements IQueryHandler<GetCommentByIdQuery, CommentsViewDto>
{
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly statusRepository: StatusRepository,
  ) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentsViewDto> {
    console.log();
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userId) {
      const status = await this.statusRepository.findStatus(
        query.userId,
        query.commentid,
        Category.Comment,
      );
      userStatus = status ? status.status : LikeStatus.None;
    }

    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(query.commentid, userStatus)
  }
}
