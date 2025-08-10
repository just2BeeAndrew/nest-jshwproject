import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/comments.entity';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: CommentModelType,
  ) {}

  async getCommentByIdOrNotFoundFail(
    id: string,
    status: LikeStatus,
  ): Promise<CommentsViewDto> {
    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{message: "Comment not found", key: "comment"}]

      });
    }

    return CommentsViewDto.mapToView(comment, status);
  }
}