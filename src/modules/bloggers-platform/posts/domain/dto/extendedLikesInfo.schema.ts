import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ExtendedLikesInfo {
  @Prop({type: Number, default: 0})
  likesCount: number;

  @Prop({type: Number, default: 0})
  dislikesCount: number;
}