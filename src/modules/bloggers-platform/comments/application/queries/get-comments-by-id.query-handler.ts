import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';

export class GetCommentByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler
  implements IQueryHandler<GetCommentByIdQuery, CommentsViewDto>
{
  constructor(private readonly commentsQueryRepository: CommentsQueryRepository) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentsViewDto> {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(query.id)
  }
}
