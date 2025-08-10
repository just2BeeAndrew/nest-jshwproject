import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsViewDto } from '../../api/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { StatusRepository } from '../../../comments/infrastructure/status.repository';
import { Category } from '../../../../../core/dto/category';

export class GetPostByIdQuery {
  constructor(
    public id: string,
    public userid?: string | null,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler
  implements IQueryHandler<GetPostByIdQuery, PostsViewDto>
{
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly statusRepository: StatusRepository,
  ) {}

  async execute(query: GetPostByIdQuery): Promise<PostsViewDto> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (query.userid) {
      const status = await this.statusRepository.findStatus(
        query.userid,
        query.id,
        Category.Post,
      );

      userStatus = status ? status.status : LikeStatus.None
    }

    return this.postsQueryRepository.getByIdOrNotFoundFail(query.id, userStatus );


  }
}
