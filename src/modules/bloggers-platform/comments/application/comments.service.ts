import { Injectable } from '@nestjs/common';
import { LikesStatusDto } from '../api/input-dto/likes-status.input-dto';
import { LikeStatusCommand } from './usecases/like-status.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentInputDto } from '../api/input-dto/create-comment.input-dto';
import { CreateCommentCommand } from './usecases/create-coment.usecase';

@Injectable()
export class CommentsService {
  constructor(private commandBus: CommandBus) {}

  async createComment(
    userId: string,
    postId: string,
    content: CreateCommentInputDto,
  ): Promise<string> {
    return this.commandBus.execute<CreateCommentCommand,string>(
      new CreateCommentCommand(userId, postId, content.content),
    );
  }

  async likeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikesStatusDto,
  ) {
    return this.commandBus.execute<LikeStatusCommand>(
      new LikeStatusCommand(userId, commentId, likeStatus.likesStatus),
    );
  }
}
