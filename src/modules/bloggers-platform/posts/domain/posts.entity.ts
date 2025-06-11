import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class LikesDetails {}

@Schema()
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({ type: Array<LikesDetails>, default: [] })
  newestLikes: LikesDetails[];
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
}
