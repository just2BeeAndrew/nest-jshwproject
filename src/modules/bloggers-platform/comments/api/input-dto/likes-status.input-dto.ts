import { IsEnum } from 'class-validator';
import {LikeStatus} from '../../../../../core/dto/like-status';

export class LikesStatusDto {
  @IsEnum(LikeStatus)
  likesStatus: LikeStatus;
}
