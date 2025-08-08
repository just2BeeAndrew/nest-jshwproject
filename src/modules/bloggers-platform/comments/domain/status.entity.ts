import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../../core/dto/like-status';
import { HydratedDocument, Model } from 'mongoose';
import { CreateStatusDomainDto } from './dto/create-status.domain.dto';
import { Category } from '../../../../core/dto/category';

@Schema({timestamps: true})
export class Status {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: false })
  login: string | null = null;

  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: String, enum: Object.values(Category), required: true })
  category: Category;

  @Prop({ type: String, enum: Object.values(LikeStatus), required: true })
  status: LikeStatus;

  createdAt: Date;

  static createInstance(dto: CreateStatusDomainDto): StatusDocument {
    const status = new this();
    status.userId = dto.userId;
    status.login = dto.login ?? null;
    status.categoryId = dto.categoryId;
    status.category = dto.category;
    status.status = dto.status;

    return status as StatusDocument;
  }

  setStatus(status: LikeStatus) {
    this.status = status;
  }

  static async clean(this: StatusModelType) {
    await this.deleteMany({});
  }
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.loadClass(Status);

export type StatusDocument = HydratedDocument<Status>;

export type StatusModelType = Model<StatusDocument> & typeof Status;
