import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../domain/comments.entity';
import { Status, StatusModelType } from '../domain/likes.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(Status.name) private StatusModel: StatusModelType,
  ) {}

  async findCommentById(id: string): Promise<CommentDocument | null> {
    return  this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    })
  }

  async findStatus(userId: string, commentId: string) {
    return this.StatusModel.findOne({userId, commentId})
  }

  async save(comment: CommentDocument){
    await comment.save()
  }
}
