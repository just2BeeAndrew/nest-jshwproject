import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../domain/comments.entity';
import { Status, StatusDocument, StatusModelType } from '../domain/status.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,

  ) {}

  async findCommentById(id: string): Promise<CommentDocument | null> {
    return  this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    })
  }



  async save(comment: CommentDocument){
    await comment.save()
  }
}
