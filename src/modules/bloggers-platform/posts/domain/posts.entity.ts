import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Blog } from '../../blogs/domain/blogs.entity';

@Schema()
export class LikeDetails {
  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, nullable: true })
  userId: string | null;

  @Prop({ type: String, nullable: true })
  login: string | null;
}

@Schema()
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({ type: Array<LikeDetails>, default: [] })
  newestLikes: LikeDetails[];
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ schema: ExtendedLikesInfo, required: true })
  extendedLikesInfo: ExtendedLikesInfo;

  createdAt: Date;

  static createInstance(dto: CreatePostDomainDto): PostDocument {}
}

export const BlogSchema = SchemaFactory.createForClass(Post);

BlogSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type BlogModelType = Model<PostDocument> & typeof Post