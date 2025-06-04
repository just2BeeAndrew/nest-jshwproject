import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';
import { UserSchema } from '../../../users/domain/users.entity';



@Schema({ timestamps: true })
export class Blog{
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: String, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: Boolean, required: false, default: false})
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

UserSchema.loadClass(Blog)

export type BlogDocument = HydratedDocument<Blog>

export type BlogModelType = Model<BlogDocument>