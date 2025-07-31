import { LikeStatus } from '../../../../../core/dto/like-status';

export class CreateStatusDomainDto {
  userId: string;
  commentId: string;
  status: LikeStatus;
}