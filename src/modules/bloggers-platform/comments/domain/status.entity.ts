import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../../core/dto/like-status';
import { CommentSchema } from './comments.entity';
import { HydratedDocument, Model } from 'mongoose';
import { CreateStatusDomainDto } from './dto/create-status.domain.dto';

@Schema()
export class Status {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, enum: Object.values(LikeStatus), required: true })
  status: string;

  static create(dto: CreateStatusDomainDto): StatusDocument {
    const status = new this()
    status.userId = dto.userId
    status.commentId = dto.commentId
    status.status = dto.status

    return status as StatusDocument
  }
  setStatus(status: string) {
    this.status = status;
  }
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.loadClass(Status);

export type StatusDocument = HydratedDocument<Status>;

export type StatusModelType = Model<StatusDocument> & typeof Status;
