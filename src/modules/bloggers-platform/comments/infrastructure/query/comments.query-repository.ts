import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Comment, CommentDocument, CommentModelType } from '../../domain/comments.entity';
import { CommentsViewDto } from '../../api/view-dto/comments.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: CommentModelType
  ) {}

  async getCommentByIdOrNotFoundFail(id: string): Promise<CommentsViewDto> {
    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return CommentsViewDto.mapToView(comment);
  }
}