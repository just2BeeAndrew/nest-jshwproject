import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments.entity';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType
  ) {}

  async getCommentByIdOrNotFoundFail(id: string): Promise<CommentsViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return CommentsViewDto.mapToView(comment);
  }
}