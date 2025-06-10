import { Prop, Schema } from '@nestjs/mongoose';
import { LikeStatus } from '../../../../core/dto/like-status';

@Schema()
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({
    type: String,
    enum: Object.values(LikeStatus),
    default: LikeStatus.None
  })
  myStatus: string

  newestLikes: LikeDetails[] = []

}