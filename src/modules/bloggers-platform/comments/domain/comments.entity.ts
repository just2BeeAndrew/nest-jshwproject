import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../../../../core/dto/like-status';

@Schema()
export class CommentatorInfoType {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;
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
  content: string;

  @Prop({ type: CommentatorInfoType, required: true })
  commentatorInfo: CommentatorInfoType;

  @Prop({ type: LikesInfoType })
  likesInfo: LikesInfoType;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
