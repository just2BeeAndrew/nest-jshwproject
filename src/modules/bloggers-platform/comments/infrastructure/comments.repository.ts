import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentModelType } from '../domain/comments.entity';
import { CommentsViewDto } from '../api/view-dto/comments.view-dto';

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
