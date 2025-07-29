import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../../core/dto/like-status';
import { CommentSchema } from './comments.entity';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Status {
  @Prop({type: String, required: true})
  userId: string;

  @Prop({type: String, required: true})
  commentId: string;

  @Prop({type: String, enum:Object.values(LikeStatus), required: true})
  status: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.loadClass(Status);

export type StatusDocument = HydratedDocument<Status>;

export type StatusModelType = Model<StatusDocument> & typeof Status;