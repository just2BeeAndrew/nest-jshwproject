import { LikeStatus } from '../../../../../core/dto/like-status';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CalculateStatusCountCommand {
  constructor(
    public likesCount: number,
    public dislikeCount: number,
    public existingStatus: LikeStatus,
    public newStattus: LikeStatus,
  ) {}
}

@CommandHandler(CalculateStatusCountCommand)
export class CalculateStatusCountUseCase
  implements ICommandHandler<CalculateStatusCountCommand>
{
  constructor() {}

  async execute(
    command: CalculateStatusCountCommand,
  ): Promise<{ likesCount: number; dislikeCount: number }> {
    if (
      command.existingStatus === LikeStatus.Like &&
      command.newStattus !== LikeStatus.Like
    ) {
      command.likesCount -= 1;
    }

    if (
      command.existingStatus === LikeStatus.Dislike &&
      command.newStattus !== LikeStatus.Dislike
    ) {
      command.dislikeCount -= 1;
    }

    if (
      command.existingStatus !== LikeStatus.Like &&
      command.newStattus === LikeStatus.Like
    ) {
      command.likesCount += 1;
    }

    if (
      command.existingStatus !== LikeStatus.Dislike &&
      command.newStattus === LikeStatus.Dislike
    ) {
      command.dislikeCount += 1;
    }

    return {
      likesCount: command.likesCount,
      dislikeCount: command.dislikeCount,
    };
  }
}
