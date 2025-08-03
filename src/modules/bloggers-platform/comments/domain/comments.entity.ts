import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../core/exceptions/filters/domain-exception-codes';

export const commentConstant = {
  minLength: 20,
  maxLength: 300,
};

@Schema()
export class CommentatorInfoType {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date;

  static create(userId: string, userLogin: string): CommentatorInfoType {
    const data = new this();
    data.userId = userId;
    data.userLogin = userLogin;

    return data;
  }
}

@Schema()
export class LikesInfoType {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfoType, required: true })
  commentatorInfo: CommentatorInfoType;

  @Prop({ type: LikesInfoType })
  likesInfo: LikesInfoType;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  createdAt: Date;

  static createInstance(comment: CreateCommentDomainDto): CommentDocument {
    const newComment = new this();
    newComment.postId = comment.postId;
    newComment.content = comment.content;
    newComment.commentatorInfo = CommentatorInfoType.create(
      comment.userId,
      comment.userLogin,
    );
    newComment.likesInfo = { likesCount: 0, dislikesCount: 0 };

    return newComment as CommentDocument;
  }

  setStatusCounters(likesCount: number, dislikesCount: number) {
    this.likesInfo.likesCount = likesCount;
    this.likesInfo.dislikesCount = dislikesCount;
  }

  setComment(content: string) {
    this.content = content;
  }

  softDelete() {
    if (this.deletedAt !== null) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Bad Request',
        extensions: [{ message: 'deleted', key: 'deletedAt' }],
      });
    }
    this.deletedAt = new Date();
  }

  static async clean(this: CommentModelType) {
    await this.deleteMany({});
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
