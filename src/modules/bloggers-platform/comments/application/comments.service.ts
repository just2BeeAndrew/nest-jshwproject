import { Injectable } from '@nestjs/common';
import { LikesStatusDto } from '../api/input-dto/likes-status.input-dto';
import {
  LikeStatusCommand,
} from './usecases/like-status.usecase';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class CommentsService {
  constructor(private commandBus: CommandBus) {}

  async likeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikesStatusDto,
  ) {
    return this.commandBus.execute(
      new LikeStatusCommand(userId, commentId, likeStatus),
    );
  }
}
