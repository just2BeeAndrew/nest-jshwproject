import { Injectable } from '@nestjs/common';
import { LikesStatusDto } from '../api/input-dto/likes-status.input-dto';
import { LikeStatusUseСase } from './usecases/like-status.usecase';

@Injectable()
export class CommentsService {
  constructor(
    private likeStatuseUseCase: LikeStatusUseСase
  ) {}

  async likeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikesStatusDto,
  ) {
    return this.likeStatuseUseCase.execute(userId, commentId, likeStatus);
  }
}
