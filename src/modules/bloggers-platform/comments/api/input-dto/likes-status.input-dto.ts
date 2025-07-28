import { IsEnum } from 'class-validator';

enum LikesStatus {
  'Like' = 'Like',
  'Dislike' = 'Dislike',
  'None' = 'None',
}

export class LikesStatusDto {
  @IsEnum(LikesStatus)
  likesStatus: LikesStatus;
}
