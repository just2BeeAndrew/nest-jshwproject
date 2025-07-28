import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikesStatusDto } from '../../api/input-dto/likes-status.input-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikeStatusUseСase {
  constructor(private  commentsRepository: CommentsRepository) {
  }

  async execute(userId: string, commentId: string, likeStatus: LikesStatusDto ) {}
}